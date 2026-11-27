(() => {
  "use strict";
  const pages = [
    "자이드와 서복은 동업자였지만, 자이드는 이제 자취를 감춘 상태였다. 게다가 서복은 그동안 통행증으로 술을 몰래 운반해 왔다. 이를 추적한 미군은 터무니없게도 그 비밀 운송로로 ‘폭약’을 나른다고 단정했다. 서복에게는 위험인물이자 테러 공격 용의자라는 누명이 씌워졌다.",
    "억울한 혐의 앞에서 서복은 왕토니에게 자신의 신원을 보증해 달라고 요청했다. 이 혼란한 땅에서 붙잡을 수 있는 유일한 지푸라기였다. 하지만 미군 병사는 무심한 눈길을 던지고는 그의 희망을 산산이 깨뜨리는 말을 했다.",
    "“왕토니? 고양이를 좋아하는 그 왕토니 말인가? 오늘 폭발로 죽은 미군 세 명 중 하나야. 벌써 국기에 싸여 본국으로 보내졌어.”",
    "“서 선생.”\n\n“당신의 동료는 가해자고, 당신의 절친한 친구는 피해자야. 그래도 이 전쟁이 당신과 상관없다고 생각하나?”",
    "무심히 전해진 죽음의 소식이 천둥처럼 서복의 머릿속에서 터졌다. 불과 며칠 전 그와 술을 마시고, 집에 가고 싶다며 목 놓아 울던 젊은 장교는 끝내 전쟁에 잠긴 폐허를 벗어나지 못했다."
  ];
  window.showTonyNews = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "tony-news-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "왕토니의 죽음과 전쟁의 메아리");
    const art = document.createElement("div"); art.className = "tony-news-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/tony-news-${n}.jpg`;
      img.alt = ["군용 차량에 붙잡혀 있는 서복과 사이프", "차량 트렁크에 실린 폭발물", "폭발로 번지는 연기", "거리 위로 솟아오르는 폭발 구름"][i];
      img.draggable = false; art.append(img); return img;
    });
    const blue = document.createElement("div"); blue.className = "tony-news-blue";
    const prose = document.createElement("p"); prose.setAttribute("aria-live", "polite");
    scene.append(art, blue, prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, currentImage = -1;
    async function fade(el, from, to, duration) {
      const animation = el.animate([{opacity:from},{opacity:to}], {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function showImage(next, duration) {
      await images[next].decode();
      images[next].style.zIndex = "1";
      await fade(images[next], 0, 1, duration);
      images.forEach((img,i) => {img.style.opacity = i===next?"1":"0"; img.style.zIndex = "0";});
      currentImage = next;
    }
    async function showText() {
      busy = true; await fade(prose, 1, 0, 140);
      if (index < 3 && currentImage !== Math.min(index,1)) await showImage(Math.min(index,1),850);
      scene.dataset.step = String(index); prose.textContent = pages[index];
      await fade(prose, 0, 1, 350); busy = false;
    }
    async function explode() {
      busy = true; await fade(prose,1,0,160);
      await Promise.all([images[2].decode(), images[3].decode()]);
      await showImage(2,250);
      const shake = art.animate([
        {transform:"translate(0,0) scale(1.025)"},
        {transform:"translate(-7px,4px) scale(1.025)"},
        {transform:"translate(6px,-5px) scale(1.025)"},
        {transform:"translate(-4px,-3px) scale(1.025)"},
        {transform:"translate(5px,5px) scale(1.025)"},
        {transform:"translate(0,0) scale(1.025)"}
      ],{duration:reduced?0:420,iterations:reduced?1:9});
      const swell = images[2].animate([{transform:"scale(1)"},{transform:"scale(1.08)"}],{duration:reduced?0:950,fill:"forwards"});
      await swell.finished;
      images[3].style.zIndex="1";
      const rise = images[3].animate([{transform:"scale(1)"},{transform:"scale(1.09)"}],{duration:reduced?0:2400,fill:"forwards"});
      await fade(images[3],0,1,1400);
      await fade(blue,0,1,1100);
      shake.cancel(); swell.cancel(); rise.cancel(); art.style.visibility="hidden";
      scene.classList.add("is-blue"); index=3; await showText();
    }
    function advance() {
      if(busy) return;
      if(index===4){busy=true;window.showPrisonKitchen(scene);return;}
      if(index===2) {explode();return;}
      index++; showText();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if(previous)previous.remove(); await showText();
  };
})();
