(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "부하가 곧바로 서복을 죽이려 하자, 자이드가 차갑게 그를 밀쳐 냈다.\n“내가 하지.”\n\n그는 곧장 서복의 곁으로 다가갔다. 차가운 총구가 머리에 닿는 순간, 자이드는 중국어로 마지막 말을 내뱉었다.\n\n“입 벌려.”\n\n“입 벌려.”"
  },
  {
    "image": 1,
    "text": "“입 벌려.”"
  }
];
  window.showPrisonMouthChoice = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-mouth-choice-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","총구 앞에서 입을 벌릴 것인가");
    const art = document.createElement("div"); art.className = "prison-mouth-choice-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-mouth-choice-${n}.jpg`;
      img.alt = ["서복에게 중국어로 입을 벌리라고 말하는 자이드","마을의 큰 나무 아래 두건을 쓴 서복에게 총을 겨누는 자이드","고목 아래 쓰러진 서복과 길게 드리운 나무 그림자"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>바로 이 순간, 서복은 입을 벌릴까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="open">입을 벌린다.</button><button type="button" class="story-option" data-choice="closed">입을 벌리지 않는다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true, chosen = false, white = null;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180); const page = pages[index];
      scene.dataset.image = String(page.image); scene.dataset.step = String(index);
      if (current !== page.image) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1000);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,400);
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (chosen || scene.dataset.phase === "choice") return;
      if (index === pages.length - 1) {
        busy = true; await fade(prose,1,0,250); await fade(art,1,0.2,700);
        choices.hidden = false; scene.dataset.phase = "choice"; busy = false; return;
      }
      index++; show();
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || chosen || scene.dataset.phase !== "choice") return;
      busy = true; chosen = true;
      let stored = {}; try {stored = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
      const valid = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const choice = button.dataset.choice;
      window.storyDecisions = {...valid,...window.storyDecisions,mouthChoice:choice};
      try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
      scene.dataset.choice = choice; scene.dataset.ending = choice === "open" ? "D" : "F";
      choices.hidden = true; scene.focus({preventScroll:true}); art.style.opacity = "1";
      prose.textContent = "자이드는 곧 방아쇠를 당겼다.";
      await fade(prose,0,1,500); scene.dataset.phase = "shot";
      if (!reduced) await new Promise(resolve => setTimeout(resolve,1800));
      busy = false; await advanceScene();
    }));
    async function advanceScene() {
      if (busy) return;
      if (scene.dataset.phase === "shot") {
        busy = true; scene.dataset.phase = "fading-white";
        white = document.createElement("div"); white.className = "prison-mouth-choice-white";
        white.setAttribute("aria-hidden","true"); document.body.append(white);
        await fade(white,0,1,3000);
        scene.dataset.phase = "white-pause";
        if (scene.dataset.choice === "closed") window.pendingStoryEnding = {ending:"F",outcome:"closed-mouth"};
        busy = false; return;
      }
      if (scene.dataset.phase === "white-pause") {
        busy = true; scene.dataset.phase = "revealing-aftermath";
        await images[2].decode();
        images.forEach((img,i) => {img.style.opacity = i === 2 ? "1" : "0";});
        prose.textContent = ""; prose.style.opacity = "0"; scene.dataset.image = "2";
        await fade(white,1,0,1200); white.remove(); white = null;
        prose.textContent = "서복은 무겁게 쓰러졌다.\n\n사이프는 바닥에 엎드린 채 절망에 빠져 흐느껴 울었다.\n\n황야 위로 모래바람이 거세게 울부짖었다. 고목 아래의 이 장면은 영원히 멈춘 한순간이 되었다.\n\n아이들은 결국 다시 끌려갔다.";
        await fade(prose,0,1,700);
        scene.dataset.phase = "aftermath"; busy = false; return;
      }
      if (scene.dataset.phase === "aftermath") {
        if (scene.dataset.choice === "open") {
          if (typeof window.showPrisonHomecomingD !== "function") return;
          busy = true; const moved = await window.showPrisonHomecomingD(scene,{preview});
          if (!moved) busy = false; return;
        }
        if (scene.dataset.choice !== "closed") return;
        busy = true; scene.dataset.phase = "fading-blue";
        const blue = document.createElement("div"); blue.className = "prison-mouth-choice-blue";
        blue.lang = "ko"; blue.setAttribute("aria-live","polite");
        const endingText = document.createElement("p");
        endingText.textContent = "결국 서복은 자신과 아무 상관도 없던 이 전쟁에서 끝내 벗어나지 못했다.";
        endingText.style.opacity = "0"; blue.append(endingText); document.body.append(blue);
        await fade(blue,0,1,1500); await fade(endingText,0,1,700);
        scene.dataset.phase = "awaiting-finale"; busy = false; return;
      }
      if (scene.dataset.phase === "awaiting-finale") {
        if (typeof window.showStoryFinale !== "function") return;
        busy = true; const moved = await window.showStoryFinale(scene,{ending:"F",outcome:"closed-mouth"});
        if (!moved) busy = false; return;
      }
      await advance();
    }
    scene.addEventListener("click",event => {if (!event.target.closest("button")) advanceScene();});
    scene.addEventListener("keydown",event => {
      if (event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advanceScene();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
