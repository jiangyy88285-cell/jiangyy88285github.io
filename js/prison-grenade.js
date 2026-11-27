(() => {
  "use strict";
  function recordChoice(value) {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const valid = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    window.storyDecisions = {...valid, ...window.storyDecisions, grenadeChoice:value};
    try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
  }
  // Later chapters can implement these destinations without changing this choice.
  window.continueAfterPrisonGrenade = async (scene, choice) => {
    if (choice === "throw" && typeof window.showPrisonGrenadeNextChapter === "function") {
      return window.showPrisonGrenadeNextChapter(scene);
    }
    if (choice === "leave" && typeof window.showStoryFinale === "function") {
      return window.showStoryFinale(scene,{ending:"B",outcome:"all-sacrificed"});
    }
    return false;
  };
  window.showPrisonGrenade = async (previous = null) => {
    const scene = document.createElement("section"); scene.className = "prison-grenade-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.dataset.ending = "B";
    scene.setAttribute("aria-label","수류탄 앞에서의 선택");
    const art = document.createElement("div"); art.className = "prison-grenade-art";
    const images = [1,2].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-grenade-${n}.jpg`;
      img.alt = ["구석에 몸을 숨긴 서복과 마준생, 사이프","발치에 굴러온 수류탄"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite");
    const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>포화 속에서 오랜 시간을 보낸 사이프에게<br>폭탄은 이미 낯설지 않았다.<br>이 순간, 그는 어떻게 할까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="throw">주워서 되던진다.</button><button type="button" class="story-option" data-choice="leave">줍지 않는다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, phase = "story";
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,140); await images[index].decode();
      scene.dataset.image = String(index); scene.dataset.phase = "story";
      images[index].style.zIndex = "1"; await fade(images[index],0,1,850);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = index === 0 ? "서복과 두 사람은 어느 구석에 몸을 숨겼다." : "바로 그때, 화약 연기가 자욱한 주방의 잔해 속으로 수류탄 하나가 밤공기를 가르며 날아와 발치에 굴러떨어졌다.";
      await fade(prose,0,1,300); busy = false;
    }
    async function advance() {
      if (busy) return;
      if (phase === "awaiting-finale") {
        busy = true; const moved = await window.continueAfterPrisonGrenade(scene,"leave");
        if (!moved) busy = false; return;
      }
      if (phase !== "story") return;
      if (index === 0) {index++; await show(); return;}
      busy = true; await fade(prose,1,0,180); phase = "choice"; scene.dataset.phase = phase;
      choices.hidden = false; scene.focus({preventScroll:true}); busy = false;
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || phase !== "choice") return; busy = true;
      const value = button.dataset.choice; recordChoice(value); scene.dataset.choice = value;
      choices.hidden = true; prose.textContent = ""; scene.focus({preventScroll:true});
      if (value === "leave") {
        phase = "fading-to-blue"; scene.dataset.phase = phase;
        scene.dataset.outcome = "all-sacrificed";
        window.pendingStoryEnding = {ending:"B",outcome:"all-sacrificed"};
        scene.setAttribute("aria-label","세 사람이 희생된 결말");
        await fade(art,1,0,2600);
        prose.textContent = "결국 세 사람 모두 살아남지 못했다.";
        await fade(prose,0,1,1600);
        phase = "awaiting-finale";
      } else {
        scene.dataset.phase = "fading-to-blue";
        await fade(art,1,0,2600);
        phase = "awaiting-continuation";
        scene.setAttribute("aria-label","수류탄을 주워 되던지는 선택");
      }
      scene.dataset.phase = phase;
      busy = false;
      if (value === "throw") await window.continueAfterPrisonGrenade(scene,value);
    }));
    scene.addEventListener("click",event => {if (!event.target.closest("button")) advance();});
    scene.addEventListener("keydown",event => {
      if (event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
