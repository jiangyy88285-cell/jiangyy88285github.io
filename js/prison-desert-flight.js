(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "학교를 빠져나오자마자 서복이 소리쳤다.\n\n“쉴 틈 없어, 일어나! 서둘러, 서둘러!”"
  },
  {
    "image": 1,
    "text": "모두 비틀거리며 밀입국 알선책이 준비해 둔 큰 차에 올라탔다.\n\n낮게 울리는 엔진 소리와 함께, 차는 황량한 사막과 고비로 내달렸다."
  },
  {
    "image": 2,
    "text": "한편, 차갑고 살벌한 ‘학교’ 사무실에서 교장은 전화를 받았다.\n\n텅 빈 주방과 숙소를 본 그의 눈빛이 순식간에 싸늘해졌다. 아이들이 도망친 것이다.\n\n교장은 어두운 얼굴로 자이드에게 차갑게 명령했다.\n“아이들을 데려와. 요리사는 이제 필요 없어.”"
  }
];
  window.showPrisonDesertFlight = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-desert-flight-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","학교 탈출 후 사막으로 향하는 아이들과 추격 명령");
    const art = document.createElement("div"); art.className = "prison-desert-flight-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-desert-flight-${n}.jpg`;
      img.alt = ["학교 밖 황량한 들판에서 서둘러 이동하려는 서복","아이들을 태우고 황량한 사막 길을 달리는 버스","사무실에서 전화를 받고 추격을 명령하는 교장"][i];
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
      if (index === pages.length - 1) {
        if (typeof window.showPrisonBorderVillage !== "function") return;
        busy = true; const moved = await window.showPrisonBorderVillage(scene,{preview});
        if (!moved) busy = false; return;
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
