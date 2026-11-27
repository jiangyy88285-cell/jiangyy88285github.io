(() => {
  "use strict";
  const farewell = "다음 날, 자말은 이른바 전쟁터로 떠날 준비를 했다.\n\n“용감한 아이야.” 교장이 두 팔을 벌려 선언했다. “오늘 너는 침략자와 맞서 싸울 전사로 뽑혔다. 너는 반드시 나의 자랑, 우리 모두의 자랑이 될 것이다!”\n\n교장은 자말을 힘껏 끌어안았다. “승리를 위하여!” 그 말이 끝나자 훈련받던 아이들도 하나둘 모여들어 자말을 가운데 두고 꼭 껴안았다.";
  const hidden = "열광적인 배웅과 환호 속에서 자말은 모두에게 손을 흔들며 돌아올 수 없는 길로 향하는 차에 올랐다. 그러나 누구도 알아채지 못했다. 집념을 버리지 못한 사이프가 몰래 차에 올라 트럭의 뒤쪽 짐칸에 몸을 웅크리고 숨어든 것을. 차창 안에서 자말은 여전히 친구들에게 손을 흔들고 있었다.";
  const missing = "한편 주방은 이미 아수라장이 되어 있었다. 마준생이 허둥지둥 서복을 찾아 달려와 말을 더듬었다.\n\n“사…… 사이프가 안 보여!”";
  window.showPrisonTrunkChoice = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-trunk-choice-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","자말의 출발과 사이프의 선택");
    const art = document.createElement("div"); art.className = "prison-trunk-choice-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-trunk-choice-${n}.jpg`;
      img.alt = ["자말을 끌어안고 배웅하는 교장과 아이들","열린 차의 뒤쪽 짐칸을 바라보는 사이프","차창에서 친구들에게 손을 흔드는 자말","사이프를 찾으러 주방으로 달려온 마준생과 서복"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite");
    const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>호기심이 생긴 사이프도 무슨 일인지 알아보고 싶었다.<br>아무도 보지 않는 틈에 열린 짐칸을 바라보며, 그는……</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="hide">짐칸에 숨어 몰래 따라간다.</button><button type="button" class="story-option" data-choice="stay">호기심을 누르고 그 자리에 남는다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let busy = true, phase = "farewell";
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show(imageIndex,text) {
      busy = true; await fade(prose,1,0,180); const incoming = images[imageIndex]; await incoming.decode();
      scene.dataset.image = String(imageIndex); incoming.style.zIndex = "1";
      await fade(incoming,0,1,1100);
      images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = text; if (text) await fade(prose,0,1,400);
      scene.dataset.phase = phase; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (phase === "farewell") {
        phase = "choice"; await show(1,""); choices.hidden = false; scene.focus({preventScroll:true}); return;
      }
      if (phase === "hidden") {phase = "missing"; await show(3,missing); return;}
      if (phase === "awaiting-stay" && typeof window.showPrisonChildrenRescue === "function") {
        busy = true; const moved = await window.showPrisonChildrenRescue(scene,"stay",{preview});
        if (!moved) busy = false; return;
      }
      if (phase === "missing" || phase === "awaiting-stay") {
        if (typeof window.showPrisonTrunkNextChapter === "function") {
          busy = true;
          const moved = await window.showPrisonTrunkNextChapter(scene,phase === "missing" ? "hide" : "stay",{preview});
          if (!moved) busy = false;
        }
      }
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || phase !== "choice") return; busy = true;
      let stored = {}; try {stored = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
      const valid = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const value = button.dataset.choice;
      window.storyDecisions = {...valid,...window.storyDecisions,saifTrunk:value};
      try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
      scene.dataset.choice = value; choices.hidden = true; scene.focus({preventScroll:true});
      if (value === "hide") {phase = "hidden"; await show(2,hidden);}
      else {
        phase = "fading-to-blue"; scene.dataset.phase = phase;
        await fade(art,1,0,2600); prose.textContent = "";
        phase = "awaiting-stay"; scene.dataset.phase = phase; busy = false;
      }
    }));
    scene.addEventListener("click",event => {if (!event.target.closest("button")) advance();});
    scene.addEventListener("keydown",event => {
      if (event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(0,farewell); return true;
  };
})();
