(() => {
  "use strict";
  const rescuePages = [
    {image:1,text:"서복은 장을 보러 간다는 핑계로 밀입국 알선책을 찾아갔다.\n\n“삼천 달러. 한 푼도 깎아 줄 수 없어.” 알선책은 손가락 세 개를 펴 보였다. 말투는 차가웠고 협상의 여지는 없었다.\n\n서복은 주머니 속 돈을 모조리 꺼냈다.\n“이천. 남은 돈은 이게 전부요.”\n“부족해.”"},
    {image:2,text:"서복은 곧바로 금니 하나를 꺼냈다. 전에 교장에게 받았던 바로 그 금니였다.\n\n“이것도 더하겠소!”"},
    {image:3,text:"서복은 말없이 침묵했다. 아무 대답도 하지 않은 채 채소를 챙겨 서둘러 떠났다.\n\n그는 알고 있었다. 이것이 자신과 아이들이 지옥에서 벗어날 유일한 길이라는 것을."}
  ];
  const selfPages = [{image:3,text:"서복은 우선 자신부터 지키는 편이 낫겠다고 결심했다. 그는 밀입국 알선책을 찾아가 약속을 정하고, 다른 아이들은 두고 사이프와 단둘이 달아나기로 했다."}];
  window.showPrisonRescueChoice = async (previous = null, {preview = false} = {}) => {
    let saved = {}; try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit")) return false;
    const scene = document.createElement("section"); scene.className = "prison-rescue-choice-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들을 구할 것인가, 자신을 지킬 것인가");
    const art = document.createElement("div"); art.className = "prison-rescue-choice-art";
    const images = [0,1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = n === 0 ? "../js/images/prison-after-ma-4.jpg" : `../js/images/prison-rescue-choice-${n}.jpg`;
      img.alt = ["떠나기 전 아이들을 돌아보는 서복","삼천 달러를 요구하는 밀입국 알선책","서복이 꺼낸 금니","채소를 챙겨 알선책을 떠나는 서복"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite");
    const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>떠나려던 서복의 발걸음이 갑자기 멈췄다.<br>위험도 모르는 아이들을 돌아보며 마음이 격렬하게 흔들렸다.<br>자신의 목숨까지 걸고, 승산이 거의 없는 구출에 나서야 할까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="save">목숨을 걸고 아이들을 구한다.</button><button type="button" class="story-option" data-choice="self">아이들을 구하지 않고 자신을 지킨다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let busy = true, phase = "fading", pages = [], index = 0;
    async function fade(el,from,to,ms) {
      const a = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : ms,easing:"ease-in-out",fill:"forwards"});
      await a.finished; el.style.opacity = String(to); a.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180);
      const page = pages[index], incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
      await fade(incoming,0,1,1100);
      images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";});
      scene.dataset.image = String(page.image); scene.dataset.step = String(index);
      prose.textContent = page.text; await fade(prose,0,1,450);
      phase = index === pages.length-1 ? "awaiting-continuation" : "story"; scene.dataset.phase = phase; busy = false;
    }
    async function advance() {
      if (busy || phase === "choice") return;
      if (phase === "awaiting-continuation") {
        const next = scene.dataset.choice === "save" ? window.showPrisonSecretOath : window.showPrisonSelfEscapeE;
        if (typeof next !== "function") return;
        busy = true; const moved = await next(scene,{preview});
        if (!moved) busy = false; return;
      }
      index++; await show();
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || phase !== "choice") return; busy = true;
      let stored = {}; try {stored = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
      const valid = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const choice = button.dataset.choice;
      window.storyDecisions = {...valid,...window.storyDecisions,childrenRescue:choice};
      try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
      scene.dataset.choice = choice; scene.dataset.ending = choice === "save" ? "D" : "E";
      if (choice === "self") images[3].src = "../js/images/prison-self-escape-e-0.jpg";
      choices.hidden = true; scene.focus({preventScroll:true}); pages = choice === "save" ? rescuePages : selfPages; index = 0; await show();
    }));
    scene.addEventListener("click",event => {if (!event.target.closest("button")) advance();});
    scene.addEventListener("keydown",event => {
      if (event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); images[0].style.opacity = "1";
    document.body.append(scene); scene.focus({preventScroll:true}); if (previous) previous.remove();
    await fade(images[0],1,0.2,2200); choices.hidden = false;
    phase = "choice"; scene.dataset.phase = phase; busy = false; return true;
  };
})();
