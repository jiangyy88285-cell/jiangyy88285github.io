(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "“네, 내일 정오에 뵙겠습니다. 감사합니다. 안녕히 계세요.”\n\n사이프는 마을 사람에게 휴대전화를 빌려 경찰에 신고하고 상황을 설명했다."
  },
  {
    "image": 1,
    "text": "자리를 잡은 뒤, 사이프는 서복에게 내일 정오에 경찰이 데리러 올 것이라고 말했다.\n\n서복은 마을의 여인에게 냄비와 식재료를 빌려, 굶주린 아이들을 위해 김이 모락모락 나는 음식을 한 솥 가득 만들었다."
  },
  {
    "image": 2,
    "text": "“정말 좋은 냄새예요. 이게 뭐예요?”\n\n아이들은 둘러앉아 맛있게 먹으며 서복에게 궁금한 듯 물었다.\n\n다시 생기를 되찾은 아이들을 바라보며 서복이 부드럽게 웃었다.\n“이게 바로 후이판이란다.”"
  },
  {
    "image": 3,
    "text": "밤이 내려앉고, 버려진 모스크 앞에서 모닥불이 잔잔하게 일렁였다. 서복과 사이프는 불가에 나란히 앉았다. 서복은 고국에 돌아가면 무엇을 할 생각인지 조용히 물었다.\n\n사이프는 고개를 숙이고 작은 목소리로 말했다.\n“리나 선생님과 수수를 찾으러 가고 싶어요. 아저씨는요?”\n\n서복은 장작 하나를 불 속에 넣고 깊은 눈빛으로 먼 곳을 바라보았다.\n“난 집으로 가야지. 딸과 어머니가 집에서 기다리고 계시거든.”\n\n사이프는 성한 눈을 천천히 들어 올렸다. 그리움과 아쉬움이 가득한 눈빛으로 작게 물었다.\n“그럼 다시 돌아오실 거예요?”\n\n서복이 온화하게 웃었다.\n“그럼.”"
  },
  {
    "image": 4,
    "text": ""
  },
  {
    "image": 4,
    "text": "그러나 운명은 그들을 이대로 놓아주지 않았다.\n\n이튿날 새벽, 요란하고 거친 발소리가 마을의 평온을 찢어 놓았다—"
  }
];
  window.showPrisonVillageNight = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-village-night-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","마을에서의 식사와 모닥불 곁의 약속");
    const art = document.createElement("div"); art.className = "prison-village-night-art";
    const images = [1,2,3,4,5].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-village-night-${n}.jpg?v=2`;
      img.alt = ["마을 사람의 전화를 빌려 경찰에 연락하는 사이프","아이들을 위해 큰 냄비에 음식을 만드는 서복","따뜻한 음식을 나누어 먹는 아이들","모닥불 곁에 나란히 앉은 서복과 사이프","모스크 아치 너머로 보이는 마을의 나무"][i];
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
        if (typeof window.showPrisonVillageCapture !== "function") return;
        busy = true; const moved = await window.showPrisonVillageCapture(scene,{preview});
        if (!moved) busy = false; return;
      }
      if (index === 3 && scene.dataset.phase !== "blue-pause") {
        busy = true; scene.dataset.phase = "fading-blue";
        await Promise.all([fade(prose,1,0,600),fade(art,1,0,2400)]);
        prose.textContent = ""; scene.dataset.image = "-1";
        scene.dataset.phase = "blue-pause"; busy = false; return;
      }
      if (scene.dataset.phase === "blue-pause") {
        images.forEach(img => {img.style.opacity = "0";});
        art.style.opacity = "1";
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
