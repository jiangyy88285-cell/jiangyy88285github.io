(() => {
  "use strict";
  const paragraphs = [
    "다행히 마준생과 서복은 고아원 아이들을 데리고 무사히 방공호로 피신했다. 방공호 안은 어두웠고, 뜨거운 먼지와 습기가 가득했다.",
    "서복은 한쪽 무릎을 꿇고 희미한 빛에 의지해 쑤쑤의 상처를 살폈다. 천 조각으로 조심스럽게 상처를 감싸며, 목소리를 낮춰 다정하게 달랬다.\n“자, 우리 쑤쑤가 제일 씩씩하지, 그렇지?”",
    "그 말을 듣자 겁에 질려 있던 소녀는 끝내 눈물을 터뜨렸다. 두 팔을 벌려 서복에게 꼭 안아 달라고 했다. 서복은 쑤쑤를 품에 안고 주위를 둘러보았다.",
    "좁고 어두운 방공호는 피란민들로 가득했다. 울부짖음과 신음이 뒤섞였고, 사람들의 얼굴에는 공포와 참혹한 현실 앞의 무감각이 어려 있었다. 눈앞의 처참한 광경에 서복의 마음은 크게 흔들렸다. 그제야 그는 전쟁의 냉혹함과 잔인함을 뼛속 깊이 실감했다."
  ];
  window.showAftermath = (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "aftermath-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "피난과 방공호");
    scene.innerHTML = '<div class="aftermath-art"><img src="../js/images/aftermath-escape.jpg" alt="서둘러 피신하는 사람들" draggable="false"><img src="../js/images/aftermath-street.jpg" alt="불길과 혼란 속의 거리" draggable="false"><img src="../js/images/aftermath-city.jpg" alt="전쟁의 화염에 휩싸인 도시" draggable="false"></div><div class="aftermath-wash"></div><p class="aftermath-prose" aria-live="polite"></p>';
    const images = scene.querySelectorAll("img"), prose = scene.querySelector(".aftermath-prose"), wash = scene.querySelector(".aftermath-wash");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true;
    async function fade(element,from,to,duration) {
      const animation = element.animate([{opacity:from},{opacity:to}],{duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; element.style.opacity = String(to); animation.cancel();
    }
    const hold = () => new Promise(resolve=>setTimeout(resolve,reduced?0:1400));
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey || event.ctrlKey || event.metaKey) return;
      if(event.code === "Space" || event.key === "Enter") {event.preventDefault();advance();}
    });
    async function advance() {
      if(busy) return;
      if(index === paragraphs.length - 1) {busy=true;window.showReturnHome(scene);return;}
      busy = true; await fade(prose,1,0,160);
      prose.textContent = paragraphs[++index]; await fade(prose,0,1,350); busy = false;
      if(index === paragraphs.length - 1) scene.classList.add("is-complete");
    }
    document.body.append(scene); scene.focus({preventScroll:true});
    if(previous) previous.remove();
    (async()=>{
      for(let i=0;i<images.length;i++) {
        await images[i].decode(); scene.dataset.image = i;
        await fade(images[i],0,1,1100);
        if(i<2) {await hold();await fade(images[i],1,0,800);}
      }
      await fade(wash,0,1,400);
      prose.textContent = paragraphs[0]; await fade(prose,0,1,400); busy = false;
    })();
  };
})();
