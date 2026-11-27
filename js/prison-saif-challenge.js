(() => {
  "use strict";
  const pages = [
    "아래층 운동장에서 교장의 고함이 창문을 뚫고 들려왔다.\n“누가 도전하겠나? 누구 없나? 다들 배짱이 없는 거냐?”\n\n“사이프, 감자 다 손질하면 양파도 몇 개 까라.”\n서복은 말하다 뒤를 돌아보고서야 사이프가 벌써 사라졌다는 것을 알아챘다.\n\n“사이프?”",
    "눈 깜짝할 사이, 분노를 참지 못한 사이프는 이미 아래층 운동장으로 뛰쳐나가 있었다.",
    "서복과 마준생은 그 모습을 보고 미친 듯이 쫓아가 막아섰다. 다급해 얼굴이 벌게진 마준생은 이 아이가 죽을 일을 자초할까 두려워, 화가 난 나머지 사이프의 뺨을 한 대 때렸다.\n\n“누가 하겠나?”\n교장은 주위를 둘러보며 다시 한번 차갑게 물었다."
  ];
  window.showPrisonSaifChallenge = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    if (!preview && ((window.storyDecisions?.chiliWater ?? saved?.chiliWater) !== "fake" || (window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice) !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-saif-challenge-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","운동장으로 뛰쳐나간 사이프");
    const art = document.createElement("div"); art.className = "prison-saif-challenge-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-saif-challenge-${n}.jpg`;
      img.alt = ["교장의 고함을 듣는 아이들","운동장으로 뛰쳐나간 사이프","사이프를 막으려 다급히 쫓아온 서복과 마준생"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite");
    const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>사이프는 끝까지 도전하겠다고 할까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="withdraw">그만두고 돌아간다.</button><button type="button" class="story-option" data-choice="insist">끝까지 도전한다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, phase = "story";
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180); await images[index].decode();
      scene.dataset.image = String(index); images[index].style.zIndex = "1";
      await fade(images[index],0,1,1000);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = pages[index]; await fade(prose,0,1,400);
      scene.dataset.phase = "story"; busy = false;
    }
    async function advance() {
      if (busy || phase !== "story") return;
      if (index < pages.length - 1) {index++; await show(); return;}
      busy = true; await fade(prose,1,0,180);
      phase = "choice"; scene.dataset.phase = phase; choices.hidden = false;
      scene.focus({preventScroll:true}); busy = false;
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || phase !== "choice") return; busy = true;
      let stored = {};
      try {stored = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
      const valid = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const value = button.dataset.choice;
      window.storyDecisions = {...valid,...window.storyDecisions,saifChallenge:value};
      try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
      scene.dataset.choice = value; phase = "awaiting-continuation"; scene.dataset.phase = phase;
      choices.hidden = true; prose.textContent = ""; scene.focus({preventScroll:true});
      if (typeof window.showPrisonSaifChallengeOutcome === "function") {
        await window.showPrisonSaifChallengeOutcome(scene,value,{preview});
      }
    }));
    scene.addEventListener("click",event => {if (!event.target.closest("button")) advance();});
    scene.addEventListener("keydown",event => {
      if (event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
