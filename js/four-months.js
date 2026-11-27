(() => {
  "use strict";
  const steps = [
    {image:0,text:"4개월 후"},
    {image:1,text:"눈 깜짝할 사이 넉 달이 흘렀다. 용식당의 장사는 유난히 잘되었다."},
    {image:1,text:"가게에는 빈자리가 없었다. 피어오르는 기름 연기와 시끌벅적한 소란이 한데 뒤섞였다."},
    {image:1,text:"함께 온 마준생은 이리저리 분주하게 움직이며, 문을 열고 들어오는 손님들을 반갑게 맞이했다."},
    {image:2,text:"그는 눈을 반짝이며 사방을 살폈다. 주방과 홀을 오가며 게으름을 피우는 직원들을 찾아냈다."},
    {image:2,text:"전쟁의 그림자가 드리운 이국의 도시에서, 용식당은 향기와 온기를 품은 피난처 같았다. 저마다 다른 사람들이 이곳을 찾아와, 잠시나마 평온한 한 끼를 누렸다."}
  ];
  window.showFourMonths = () => {
    const scene = document.createElement("section");
    scene.className = "four-months-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "4개월 후, 손님으로 가득한 용식당");
    scene.innerHTML = '<div class="four-months-art"><img src="../js/images/four-months-city.png" alt="위에서 내려다본 중동의 거리" draggable="false"><img src="../js/images/four-months-service.jpg" alt="손님에게 음식을 나르는 마준생" draggable="false"><img src="../js/images/four-months-guests.jpg" alt="손님으로 가득 찬 용식당" draggable="false"></div><div class="four-months-wash"></div><p class="four-months-prose" aria-live="polite"></p>';
    const images = scene.querySelectorAll("img");
    const prose = scene.querySelector(".four-months-prose");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true;
    function applyStep() {
      const step = steps[index]; scene.dataset.step = index; scene.dataset.image = step.image;
      images.forEach((image,i)=>image.classList.toggle("is-visible", i === step.image));
      prose.textContent = step.text;
    }
    const fade = (element,from,to,duration)=>element.animate([{opacity:from},{opacity:to}],
      {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"}).finished;
    async function advance() {
      if (busy) return;
      if (index === steps.length - 1) {
        busy = true; window.showDinnerNight(scene); return;
      }
      busy = true; await fade(prose,1,0,320);
      index++; applyStep(); await fade(prose,0,1,900);
      busy = false;
      if(index === steps.length - 1) scene.classList.add("is-complete");
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey || event.ctrlKey || event.metaKey) return;
      if(event.code === "Space" || event.key === "Enter") {event.preventDefault();advance();}
    });
    applyStep(); prose.style.opacity = 0;
    document.body.append(scene); scene.focus({preventScroll:true});
    fade(scene,0,1,1200).then(()=>fade(prose,0,1,1000)).then(()=>{busy=false;});
  };
})();
