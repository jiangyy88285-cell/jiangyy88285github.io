(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "자이드가 깊이 잠든 서복을 발로 툭툭 찼다.\n\n서복은 순식간에 잠에서 깨어났다."
  },
  {
    "image": 1,
    "text": "“국경만 넘으면 괜찮을 줄 알았나? 여기에도 교장의 친구들이 있어.”\n\n자이드는 굳은 얼굴로 서복을 노려보았다."
  },
  {
    "image": 2,
    "text": "자이드는 곧 김이 모락모락 나는 후이판을 들어 한입 맛보았다. 입맛을 다시며 말했다.\n\n“이런 형편에서도 음식을 이렇게 만들다니, 역시 자네다워. 하지만 좀 짜군. 이 지역의 식재료와 양념을 잘 모르면서 평소 습관대로 만들었으니, 원하는 맛이 나올 리 없지.”"
  },
  {
    "image": 2,
    "text": "서복이 못마땅한 표정을 짓자 자이드가 눈썹을 치켜올렸다.\n“못 믿겠나? 다시 먹어 봐.”\n\n그는 밥 한 숟갈을 떠서 내밀었다.\n“입 벌려.”\n\n서복이 입술을 굳게 다문 채 먹지 않자, 자이드가 다시 명령했다.\n“입 벌려!”"
  },
  {
    "image": 2,
    "text": "서복은 예전에 자신이 자이드에게 밥을 먹여 주던 순간을 떠올렸다. 눈빛이 잠시 흔들리더니 천천히 입을 벌려 받아먹었다.\n\n“그렇지?” 자이드가 음험한 눈빛으로 서복을 바라보았다.\n“서복, 쓸데없이 참견하지 말았어야지. 네 아이들도 아니잖아.”\n\n서복은 힘겹게 밥을 삼켰다. 목소리는 쓰라렸지만 단호했다.\n“그래도 아이들이잖아.”"
  },
  {
    "image": 2,
    "text": "그때 무장한 부하 하나가 급히 달려와 보고했다.\n“장교님, 근처에서 순찰 중인 국경수비대를 발견했습니다.”\n\n자이드의 얼굴이 어두워졌다. 그가 서복에게 말했다.\n“이제 갈 시간이군.”"
  },
  {
    "image": 3,
    "text": "곧 부하 두 명이 서복을 거칠게 붙잡아 끌고 갔다.\n\n겁에 질린 서복의 온몸에서 식은땀이 흘렀다."
  },
  {
    "image": 4,
    "text": "서복이 위험에 처한 것을 본 사이프는 갑자기 미친 듯이 달려들었다. 서복을 붙잡은 부하에게 매달려 필사적으로 잡아당겼지만, 이내 거칠게 바닥에 눌렸다.\n\n“도망쳐요, 스승님!”"
  },
  {
    "image": 5,
    "text": "“괜찮아, 얘야.”\n\n서복은 애써 침착한 척하며 사이프를 달랬다.\n\n곧 두꺼운 검은 두건이 머리에 씌워지고, 눈앞이 캄캄해졌다."
  },
  {
    "image": 4,
    "text": "“스승님!”\n\n사이프가 목이 터져라 절규했다.\n그의 눈에서 절망의 눈물이 흘러내렸다."
  }
];
  window.showPrisonVillageCapture = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-village-capture-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","마을에 들이닥친 자이드와 서복의 체포");
    const art = document.createElement("div"); art.className = "prison-village-capture-art";
    const images = [1,2,3,4,5,6].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-village-capture-${n}.${n === 3 ? "png" : "jpg"}`;
      img.alt = ["잠에서 깨어나는 서복","서복을 내려다보는 자이드","후이판을 맛보며 서복에게 먹이는 자이드","무장한 부하들에게 끌려가는 서복","바닥에 눌린 채 서복을 부르는 사이프","검은 두건이 씌워진 서복"][i];
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
        if (typeof window.showPrisonMouthChoice !== "function") return;
        busy = true; const moved = await window.showPrisonMouthChoice(scene,{preview});
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
