(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "금요일 새벽 세 시, 사방은 고요했다.\n\n짙은 어둠이 ‘학교’를 뒤덮고 있었다."
  },
  {
    "image": 1,
    "text": "죽은 듯한 정적 속에서 작은 몸들이 그림자 사이로 소리 없이 움직였다.\n\n서복은 차 옆에 몸을 낮게 웅크리고 긴장한 얼굴로 아이들의 수를 세었다.\n\n“열셋…… 열넷…… 열다섯…… 열여섯…… 서둘러, 서둘러! …… 열아홉……”"
  },
  {
    "image": 2,
    "text": "“조심해…… 스물…… 스물하나…… 스물둘…… 스물셋!”"
  },
  {
    "image": 3,
    "text": "사이프가 낮은 목소리로 외쳤다.\n“다 모였어요!”\n\n서복은 뒤를 돌아 주변을 한 바퀴 훑어보았다. 눈빛을 굳히고 단호하게 명령했다.\n“가자!”"
  },
  {
    "image": 4,
    "text": "교장이 깊이 잠든 틈을 타, 서복은 앞장서서 막혀 있던 쇠창살을 두드려 열고 모두를 이끌어 하수관으로 빠져나갔다.\n\n서복이 앞에서 길을 살피는 동안, 사이프는 행렬 맨 뒤를 지키며 모두에게 서둘러 따라오라고 애타게 재촉했다."
  }
];
  window.showPrisonFridayEscape = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-friday-escape-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","금요일 새벽 세 시, 스물세 아이의 탈출");
    const art = document.createElement("div"); art.className = "prison-friday-escape-art";
    const images = [1,2,3,4,5].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-friday-escape-${n}.jpg`;
      img.alt = ["달빛 아래 고요한 학교의 밤","그림자를 따라 조용히 이동하는 아이들","라디오 옆에서 잠든 경비","아이들을 차례로 내려보내며 돕는 서복과 사이프","하수관으로 빠져나가기 위해 쇠창살을 여는 손"][i];
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
        if (typeof window.showPrisonDesertFlight !== "function") return;
        busy = true; const moved = await window.showPrisonDesertFlight(scene,{preview});
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
