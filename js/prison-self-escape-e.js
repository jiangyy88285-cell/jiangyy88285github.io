(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "며칠 뒤 깊은 밤, 서복은 사이프와 함께 탈출을 시작했다."
  },
  {
    "image": 1,
    "text": "서복은 막혀 있던 쇠창살을 두드려 열었다.\n\n두 사람은 그 틈으로 빠져나갔다."
  },
  {
    "image": 2,
    "text": "서복과 사이프는 함께 도망쳤다.\n\n하지만 다른 아이들은 그곳에 영원히 남겨졌다."
  }
];
  window.showPrisonSelfEscapeE = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "self")) return false;
    const scene = document.createElement("section"); scene.className = "prison-self-escape-e-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들을 남겨 두고 사이프와 탈출하는 서복, 결말 E");
    const art = document.createElement("div"); art.className = "prison-self-escape-e-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-self-escape-e-${n}.jpg`;
      img.alt = ["달빛 아래 고요한 학교의 밤","탈출하려고 쇠창살을 여는 손","서복과 사이프를 태우고 황야를 달리는 차"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true;
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
      if (scene.dataset.phase === "awaiting-finale") {
        if (typeof window.showStoryFinale !== "function") return;
        busy = true; const moved = await window.showStoryFinale(scene,{ending:"E",outcome:"children-left-behind"});
        if (!moved) busy = false; return;
      }
      if (index === pages.length - 1) {
        busy = true; scene.dataset.phase = "fading-blue";
        const blue = document.createElement("div"); blue.className = "prison-self-escape-e-blue";
        blue.setAttribute("aria-hidden","true"); blue.addEventListener("click",advance); document.body.append(blue);
        await fade(blue,0,1,1800); prose.textContent = "";
        scene.dataset.phase = "awaiting-finale"; scene.dataset.ending = "E";
        window.pendingStoryEnding = {ending:"E",outcome:"children-left-behind",storyEnded:true};
        busy = false; return;
      }
      index++; show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
