(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "깊은 밤, 모두가 잠든 사이 문밖에서 갑자기 다급하고 거친 노크 소리가 울렸다.\n\n마준생이 놀라 잠에서 깨어 황급히 물었다.\n“누구세요?”\n“잠깐만요.”"
  },
  {
    "image": 1,
    "text": "문을 여는 순간, 교장과 무장한 사람들이 문 앞을 빽빽이 막고 있었다.\n“교장님.” 마준생이 억지로 웃었다.\n\n교장은 어두운 얼굴로 사람들을 이끌고 안으로 들어왔다. 소리를 듣고 달려온 서복은 불길한 예감이 들었다.\n“무슨 일이십니까, 교장님?”\n“아이들에게 뭘 먹였나? 왜 거의 모든 아이가 배탈이 난 거지?” 교장이 날카롭게 추궁했다.\n서복이 멈칫했다. “배탈이라니요?”\n마준생도 급히 몸을 바로 세우며 걱정스레 물었다.\n“아이들은 괜찮습니까, 교장님?”"
  },
  {
    "image": 1,
    "text": "“가벼운 식중독이다. 의사는 적어도 닷새는 쉬어야 한다더군.”\n교장의 눈빛은 차갑고 살기로 가득했다. 그는 한 걸음씩 다가왔다.\n\n서복이 의아한 얼굴로 마준생을 돌아보았다.\n“그럴 리가 없는데. 늘 하던 대로 만든 음식인데 식중독이라니?”\n\n“나는 내일 아이들을 모두 전선에 보내겠다고 맹세했다. 네가 내 맹세를 어기게 만들었어.” 교장의 목소리에는 온기라고는 없었다.\n“무릎 꿇어!”"
  },
  {
    "image": 2,
    "text": "“교장님……” 서복의 눈에 당혹감과 애원이 가득했다.\n“이러지 마세요!” 그제야 마준생은 상황이 심상치 않다는 것을 깨달았다.\n\n“대가를 치러야 한다. 무릎 꿇어.” 교장이 차갑게 명령했다. 그러고는 권총을 뽑아 검은 총구를 서복의 이마에 겨눴다.\n“죽어서 평안을 얻기를.”"
  }
];
  window.showPrisonPotatoConfession = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk))) return false;
    const scene = document.createElement("section"); scene.className = "prison-potato-confession-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","한밤중의 추궁과 마준생의 선택");
    const art = document.createElement("div"); art.className = "prison-potato-confession-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-potato-confession-${n}.jpg`;
      img.alt = ["깊은 밤 잠든 서복과 마준생, 사이프","무장한 사람들과 찾아온 교장","서복에게 권총을 겨누는 교장"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite");
    const choices = document.createElement("div"); choices.className = "tasting-choices"; choices.hidden = true;
    choices.innerHTML = '<h2>마준생은 교장을 속이려고 일부러 싹 난 감자를 넣었지만,<br>곧바로 들통나고 말았다.<br>더는 숨길 수 없게 되자, 그는……</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="admit">자신이 넣었다고 솔직히 털어놓는다.</button><button type="button" class="story-option" data-choice="deny">끝까지 부인하고 절대 인정하지 않는다.</button></div>';
    scene.append(art,prose,choices);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true, phase = "story";
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
      if (phase === "awaiting-finale") {
        if (typeof window.showStoryFinale === "function") {
          busy = true; const moved = await window.showStoryFinale(scene,{ending:"C",outcome:"all-sacrificed"}); if (!moved) busy = false;
        }
        return;
      }
      if (phase === "awaiting-admit") {
        if (typeof window.showPrisonConfessionNextChapter === "function") {
          busy = true; const moved = await window.showPrisonConfessionNextChapter(scene,{preview}); if (!moved) busy = false;
        }
        return;
      }
      if (phase === "choice") return;
      if (index === pages.length - 1) {
        busy = true; await fade(prose,1,0,250); choices.hidden = false;
        phase = "choice"; scene.dataset.phase = phase; scene.focus({preventScroll:true}); busy = false; return;
      }
      index++; await show();
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation(); if (busy || phase !== "choice") return; busy = true;
      let stored = {}; try {stored = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
      const valid = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
      const choice = button.dataset.choice;
      window.storyDecisions = {...valid,...window.storyDecisions,potatoConfession:choice};
      try {sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));} catch {}
      choices.hidden = true; scene.dataset.choice = choice; scene.focus({preventScroll:true});
      if (choice === "admit") {
        phase = "awaiting-admit"; scene.dataset.phase = phase;
        await fade(prose,0,1,400); busy = false;
        if (typeof window.showPrisonConfessionNextChapter === "function") await advance();
        return;
      }
      phase = "fading-to-blue"; scene.dataset.phase = phase; prose.textContent = "";
      await fade(art,1,0,2200);
      scene.dataset.image = "-1"; scene.dataset.ending = "C"; scene.dataset.outcome = "all-sacrificed";
      window.pendingStoryEnding = {ending:"C",outcome:"all-sacrificed"};
      prose.textContent = "완전히 이성을 잃은 교장은 먼저 서복을 쏘아 죽였다. 이어 차가운 총구를 마준생과 사이프에게 돌렸다. 그의 눈에는 두 사람 역시 용서할 수 없는 공범이었다.\n\n귀를 찢는 총성이 지나간 뒤, 세 사람은 누구도 살아남지 못한 채 모두 피 웅덩이 속에 쓰러졌다.";
      await fade(prose,0,1,1400); phase = "awaiting-finale"; scene.dataset.phase = phase; busy = false;
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
