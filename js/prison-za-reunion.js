(() => {
  "use strict";
  const approach = "테러리스트들의 우두머리가 총을 든 채 서복을 향해 한 걸음씩 다가왔다. 서복은 황급히 몸으로 뒤에 있는 사이프를 가로막고, 자신은 중국인이라고 목이 터져라 외쳤다.";
  const rescuedPages = [
    approach,
    "그러나 검은 그림자가 가까이 다가와 흔들리는 불빛에 얼굴이 드러나자, 서복은 그대로 얼어붙었다. 눈앞의 무장 대원은 오랫동안 자취를 감췄던 동업자 자이드였다! 자이드 역시 복잡한 눈빛으로 서복을 바라보았다.",
    "“교장님이 찾으시던 중국인 요리사들입니다. 미군 고용인이라고 합니다.” 곁에 있던 부하가 보고했다.\n\n“그럼 데려가.” 자이드가 낮은 목소리로 대답했다."
  ];
  window.showPrisonZaReunion = async (previous = null, previewChoice = null) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const choice = previewChoice ?? window.storyDecisions?.chiliWater ?? saved?.chiliWater;
    const grenade = window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice;
    if (!["fake","real"].includes(choice) || (!previewChoice && grenade !== "throw")) return false;
    const rescued = choice === "fake";
    const scene = document.createElement("section"); scene.className = "prison-za-reunion-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.dataset.choice = choice;
    scene.setAttribute("aria-label", rescued ? "자이드와의 재회" : "구하지 못한 세 사람");
    const art = document.createElement("div"); art.className = "prison-za-reunion-art";
    const images = (rescued ? [1,2,3] : [1]).map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-za-reunion-${n}.jpg`;
      img.alt = ["총을 든 채 다가오는 무장 대원들","얼굴을 가린 자이드","얼굴을 드러낸 자이드"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, phase = "story";
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,160); await images[index].decode();
      scene.dataset.image = String(index); images[index].style.zIndex = "1";
      await fade(images[index],0,1,1000);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = rescued ? rescuedPages[index] : approach + "\n\n“이 셋은 미국의 개들이다!”";
      await fade(prose,0,1,400); scene.dataset.phase = "story"; busy = false;
      if (rescued && index === rescuedPages.length - 1) scene.dataset.phase = "complete";
    }
    async function end() {
      busy = true; phase = "fading-to-blue"; scene.dataset.phase = phase;
      await Promise.all([fade(art,1,0,2600),fade(prose,1,0,800)]);
      scene.dataset.image = "-1"; scene.dataset.ending = "A"; scene.dataset.outcome = "all-sacrificed";
      window.pendingStoryEnding = {ending:"A",outcome:"all-sacrificed"};
      prose.textContent = "결국 서복과 두 사람은 모두 살아남지 못했다.";
      await fade(prose,0,1,1600); phase = "awaiting-finale"; scene.dataset.phase = phase; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (phase === "awaiting-finale") {
        if (typeof window.showStoryFinale === "function") {
          busy = true; await window.showStoryFinale(scene,{ending:"A",outcome:"all-sacrificed"});
        }
        return;
      }
      if (!rescued) {await end(); return;}
      if (index === rescuedPages.length - 1) {
        busy = true;
        const moved = await window.showPrisonSchoolTransport(scene,{preview:previewChoice === "fake"});
        if (!moved) busy = false;
        return;
      }
      index++; await show();
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
