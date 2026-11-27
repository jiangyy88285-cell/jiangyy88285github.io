(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "도망치는 길, 트럭은 울퉁불퉁한 고비를 거칠게 내달렸다.\n\n갑자기 차 안의 아이들이 창밖을 향해 신나게 환호성을 질렀다. 운전하던 서복은 가슴이 철렁했다. 추격대가 따라붙은 줄 알고 순식간에 식은땀이 흘렀다."
  },
  {
    "image": 1,
    "text": "서복은 가속 페달을 힘껏 밟으며 고개를 들어 보았다.\n\n그런데 아이들이 본 것은 사막을 달리는 낙타 떼였다."
  },
  {
    "image": 2,
    "text": "아이들은 신기한 듯 얼굴 가득 웃음을 띠고 즐거워하고 있었다.\n\n아이들은 본래 이토록 순수했다. 잔혹한 전쟁이 그들을 짓밟았을 뿐이었다."
  },
  {
    "image": 3,
    "text": "그러나 평온은 오래가지 못했다. 두 시간 뒤, 낡은 트럭은 황무지 한가운데서 완전히 멈춰 섰다.\n\n군벌의 추격대가 들이닥칠까 두려웠던 서복은 아이들을 데리고 서쪽 산길을 걸을 수밖에 없었다.\n\n일행은 어둠이 내리기 전에 가까스로 국경을 넘어, 이웃 나라의 평온한 작은 마을에 도착했다."
  },
  {
    "image": 4,
    "text": "그곳의 이름이 무엇이었는지, 서복은 기억하지 못했다.\n\n다만 마을 어귀에 버려진 모스크 한 채와 굵고 힘찬 가지를 뻗은 오래된 나무 한 그루가 있었다는 것만 기억했다."
  }
];
  window.showPrisonBorderVillage = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-border-village-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","사막의 낙타와 국경 너머 작은 마을");
    const art = document.createElement("div"); art.className = "prison-border-village-art";
    const images = [1,2,3,4,5].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-border-village-${n}.jpg`;
      img.alt = ["차를 운전하는 서복과 창밖을 바라보는 아이들","사막을 달리는 낙타 떼","창가에서 낙타를 보며 즐거워하는 아이들","산길을 걸어 국경을 넘는 서복과 아이들","마을 어귀의 버려진 모스크와 오래된 나무"][i];
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
        if (typeof window.showPrisonVillageNight !== "function") return;
        busy = true; const moved = await window.showPrisonVillageNight(scene,{preview});
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
