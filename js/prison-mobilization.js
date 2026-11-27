(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "“너희와 같은 아이들을 많이 봐 왔다. 어려서 부모를 잃고 들개처럼 거리를 떠돌던 아이들 말이다.” 교장이 앞에 서서 천천히 말했다."
  },
  {
    "image": 0,
    "text": "“한 번도 배불리 먹어 보지 못한 아이도 있었다. 살아남으려고 훔치고, 빼앗고, 남은 음식 한 입을 달라며 무릎 꿇고 빌기도 했지…… 세상은 그 아이들을 외면했고, 어디에서도 자신의 가치를 찾을 수 없었다.\n\n하지만 여기서는 동료가 있기에 너희는 더 이상 혼자가 아니다. 나 역시 너희처럼 방황했다. 그러다 살아남기 위해 무기를 들고 전쟁터로 나가는 길을 택했지.”"
  },
  {
    "image": 0,
    "text": "그가 갑자기 목소리를 높였다. 말투에는 강한 선동이 담겨 있었다.\n\n“내 아이들아, 너희는 선택받은 전사들이다! 교장의 말을 기억해라. 너희는 반드시 주목받고, 기억되고, 사랑받을 것이다!\n\n하지만 지금은 비통한 소식을 전해야 한다. 며칠 전 비열한 적들이 루트바를 피로 물들였다! 우리는 복수할 것이다! 더 많은 젊은 전사가 전선으로 나가야 한다. 너희는 갈 의향이 있느냐?”"
  },
  {
    "image": 1,
    "text": "“가겠습니다!”\n“가겠습니다!”\n\n훈련받던 아이들의 눈에 광기에 휩쓸린 빛이 타올랐다. 아이들은 하나둘 자리에서 일어났다.\n\n“승리를 위하여!” 세뇌된 아이들이 총을 들어 올리며 열광적으로 외쳤다.\n\n“하늘의 가호 아래, 이틀 뒤 너희 모두 전선으로 나가 적을 무찌를 것이다!” 교장이 높이 외쳤다."
  }
];
  window.showPrisonEggNextChapter = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk))) return false;
    const scene = document.createElement("section"); scene.className = "prison-mobilization-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들을 전선으로 보내려는 교장의 연설");
    const art = document.createElement("div"); art.className = "prison-mobilization-art";
    const images = [1,2].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-mobilization-${n}.jpg`;
      img.alt = ["아이들 앞에서 연설하는 교장","교장 곁에서 열광하며 응답하는 아이들"][i];
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
        if (typeof window.showPrisonColaPromise !== "function") return;
        busy = true; const moved = await window.showPrisonColaPromise(scene,{preview});
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
