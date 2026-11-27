(() => {
  "use strict";
  const steps = [
    {image:"dinner",text:"고단한 하루의 일이 끝나고, 주방에는 노랗고 따뜻한 불빛이 감돌았다."},
    {image:"dinner",text:"서복과 마준생은 작은 탁자에 둘러앉아 저녁밥을 크게 떠먹으며, 텔레비전에서 흘러나오는 ‘미국이 곧 전쟁을 시작할 것’이라는 뉴스를 보고 있었다."},
    {image:"dinner",text:"전쟁을 둘러싼 소란과 작은 탁자 위 음식 냄새가, 기묘하고도 위태로운 대조를 이루었다."},
    {image:"news",text:"“48시간 안에 이 나라를 떠나야 합니다.”"},
    {image:"dinner",text:"뉴스 속의 일촉즉발 상황을 보며, 서복은 반찬 한 점을 집어 들었다. 의아함과 걱정이 섞인 목소리로 그가 물었다."},
    {image:"dinner",text:"“설마 정말 전쟁이 나는 건 아니겠지?”"},
    {image:"dinner",text:"마준생은 입안에 밥을 한가득 넣고 손을 내저었다. 세상 경험이 많은 사람 특유의 느긋한 태도로 서복을 안심시켰다."},
    {image:"dinner",text:"“전쟁 안 나. 그냥 말싸움하는 거야.”"},
    {image:"dinner",text:"“걱정 마. 전쟁 안 난다니까.”"}
  ];
  window.showDinnerNight = (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "dinner-night-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "불이 꺼진 뒤, 저녁 식사와 텔레비전 뉴스");
    scene.innerHTML = '<div class="dinner-night-art"><img data-image="dinner" src="../js/images/dinner-rice.jpg" alt="하루 일을 마친 두 사람의 저녁 식사" draggable="false"><img data-image="news" src="../js/images/dinner-news.jpg" alt="텔레비전 속 전쟁 관련 뉴스" draggable="false"><img data-image="night" src="../js/images/dinner-night-city.jpg" alt="깊은 밤의 도시" draggable="false"></div><div class="dinner-night-wash"></div><p class="dinner-night-prose" aria-live="polite"></p><div class="dinner-blackout"></div>';
    const images = scene.querySelectorAll("img");
    const prose = scene.querySelector(".dinner-night-prose");
    const blackout = scene.querySelector(".dinner-blackout");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phase = "darkening", busy = true, index = 0, nightTimer = 0, currentImage = null;
    const fade = (element,from,to,duration)=>element.animate([{opacity:from},{opacity:to}],
      {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"}).finished;
    async function showPicture(name, duration = 1500) {
      const incoming = [...images].find(image=>image.dataset.image === name);
      if (incoming === currentImage) return;
      // Keep the current picture opaque until the decoded incoming picture covers it.
      await incoming.decode();
      incoming.style.zIndex = "1";
      const animation = incoming.animate([{opacity:0},{opacity:1}],
        {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished;
      incoming.style.opacity = "1";
      animation.cancel();
      images.forEach(image=>{
        image.style.opacity = image === incoming ? "1" : "0";
        image.style.zIndex = "0";
      });
      currentImage = incoming;
    }
    async function applyStep(duration) {
      const step = steps[index]; scene.dataset.image = step.image;
      await showPicture(step.image, duration);
      prose.textContent = step.text;
    }
    async function showNight() {
      if (busy || phase === "night") return;
      clearTimeout(nightTimer); busy = true; phase = "night";
      await fade(prose,1,0,800);
      scene.dataset.image = "night";
      prose.textContent = "";
      await showPicture("night",2200);
      scene.classList.add("is-complete");
      scene.setAttribute("aria-label", "깊은 밤의 도시");
      busy = false;
    }
    async function advance() {
      if (busy) return;
      if (phase === "night") {
        busy = true; window.showBombing(scene); return;
      }
      busy = true;
      if (phase === "black") {
        phase = "story"; await applyStep(0);
        await fade(blackout,1,0,1600);
        await fade(prose,0,1,800);
      } else if (index < steps.length - 1) {
        await fade(prose,1,0,320); index++; await applyStep();
        await fade(prose,0,1,900);
      } else { busy = false; await showNight(); return; }
      busy = false;
      if (index === steps.length - 1) nightTimer = setTimeout(showNight,3200);
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey || event.ctrlKey || event.metaKey) return;
      if(event.code === "Space" || event.key === "Enter") {event.preventDefault();advance();}
    });
    if (!previous) scene.style.backgroundImage = 'url("../js/images/four-months-guests.jpg")';
    prose.style.opacity = 0;
    document.body.append(scene); scene.focus({preventScroll:true});
    fade(blackout,0,1,1400).then(()=>{
      scene.style.backgroundImage = "none";
      scene.style.backgroundColor = "#070c15";
      if (previous) previous.remove();
      phase = "black"; busy = false;
    });
  };
})();
