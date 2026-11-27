(() => {
  "use strict";
  const texts = [
    "깊은 밤, 모두가 잠들어 있었다.",
    "달그락, 달그락……\n\n깊이 잠들어 있던 서복은 갑작스러운 소리에 놀라 깨어났다. 도둑이 든 줄 안 그는 경계하며 겉옷을 걸치고 호미를 집어 든 채, 발소리를 죽이고 주방으로 향했다.",
    "하지만 문을 밀고 들어서자, 눈앞에 보인 것은 조리대 주변을 분주하게 오가는 어린 사이프의 모습이었다.",
    "서복은 다가가 큰소리로 꾸짖으려 했다. 하지만 사이프가 막 만든 밥을 한 숟갈 떠서 맛보자, 굳어 있던 표정이 잠시 멈칫했다. 뜻밖에도 맛이 꽤 괜찮았다.\n\n“네가 직접 만든 거야?” 서복이 놀라 물었다.",
    "사이프는 가슴을 쭉 펴고 자랑스럽게 고개를 끄덕였다.\n\n서복은 아이의 반짝이는 눈을 바라보며 요리사가 되고 싶은지 물었다. 그렇다는 대답을 듣고, 그는 사이프를 제자로 받아들였다.",
    "사실 어린 사이프가 몰래 요리를 한 것은 고아원의 배고픈 친구들에게 따뜻한 밥 한 끼를 먹이기 위해서였다.\n\n서복은 구석에 몸을 숨긴 채 조용히 그 모습을 바라보았다. 아이들이 허겁지겁 밥을 먹는 모습을 보며, 그의 입가에는 저도 모르게 따뜻한 미소가 번졌다."
  ];
  const alts = ["잠든 서복과 마준생", "한밤중의 주방 입구", "문틈 너머로 보이는 사이프", "사이프가 만든 밥을 맛보는 서복", "사이프를 제자로 받아들이는 서복", "따뜻한 밥을 나눠 먹는 아이들"];
  window.showApprentice = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "apprentice-scene";scene.lang = "ko";scene.tabIndex = -1;
    scene.setAttribute("aria-label", "한밤중에 시작된 사제의 인연");
    const art = document.createElement("div");art.className="apprentice-art";
    const images = texts.map((_,i) => {
      const image=document.createElement("img");image.src=`../js/images/apprentice-${i+1}.jpg`;
      image.alt=alts[i];image.draggable=false;art.append(image);return image;
    });
    const prose = document.createElement("p");prose.className="apprentice-prose";prose.setAttribute("aria-live","polite");
    scene.append(art,prose);
    let index=0,busy=true,current=null;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    async function fade(element,from,to,duration) {
      const animation=element.animate([{opacity:from},{opacity:to}],{duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished;element.style.opacity=String(to);animation.cancel();
    }
    async function show() {
      busy=true;await fade(prose,1,0,140);
      const incoming=images[index];await incoming.decode();incoming.style.zIndex="1";
      await fade(incoming,0,1,850);
      images.forEach(image=>{image.style.opacity=image===incoming?"1":"0";image.style.zIndex="0";});
      current=incoming;scene.dataset.step=String(index);prose.textContent=texts[index];
      await fade(prose,0,1,280);busy=false;
      if(index===texts.length-1)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===texts.length-1){busy=true;window.showStreetFire(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}
    });
    await images[0].decode();images[0].style.opacity="1";
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    show();
  };
})();
