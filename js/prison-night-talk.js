(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "깊은 밤, 서복은 사이프를 찾아가 마음을 터놓고 이야기하려 했다."
  },
  {
    "image": 1,
    "text": "“그렇게 죽고 싶어?” 서복이 붉어진 눈으로 꾸짖었다.\n“죽고 싶지 않아요.” 사이프는 고개를 숙였다.\n옆에서 마준생은 벌써 쪼그려 앉아 흐느끼고 있었다. 울음에 말도 잇지 못했다.\n\n“죽기 싫다면서 왜 전쟁터에 가려는 거야?” 서복의 목소리에는 억눌린 분노와 안타까움이 묻어났다. “내가 알리 교장한테 굽실거리며 널 보내지 말아 달라고 빌었어! 그런데 넌 왜 굳이 네 발로 나가서 손을 들어?”"
  },
  {
    "image": 1,
    "text": "“더는 괴롭힘당하고 싶지 않아요…… 쓸모없는 놈처럼 살고 싶지 않다고요.” 사이프가 이를 악물고 대꾸했다.\n\n서복은 기가 막혀 헛웃음을 지었다.\n“전쟁터에 가면 네가 쓸모없는 놈이 아니게 될 것 같아?”"
  },
  {
    "image": 2,
    "text": "서복이 손을 뻗어 사이프의 안대를 벗기려 하자, 사이프는 고개를 돌리며 거칠게 뿌리쳤다. 서복은 홧김에 아이를 한 대 때렸다.\n“가만있어!” 그는 안대를 억지로 잡아 벗겼다.\n\n“이 눈먼 자식아!” 서복은 아이를 가리켰다. 눈물이 눈가에 맺혔지만 말은 날카로웠다. “넌 이제 숟가락 드는 것조차 힘들어하면서 총을 들겠다고? 너 같은 애가 전쟁터에 나가면 쓸모없는 놈도 못 돼. 그냥 죽으러 가는 총알받이일 뿐이야!”"
  },
  {
    "image": 3,
    "text": "사이프는 서복의 손을 세차게 쳐 내고 차갑게 말했다.\n“아저씨랑 상관없어요. 내 아버지도 아니잖아요.”\n\n그는 뒤도 돌아보지 않고 몸을 돌려 떠났다. 고집스럽게 멀어지는 아이의 뒷모습을 바라보며 서복은 그 자리에 굳어 버렸다. 끝내 눈물이 걷잡을 수 없이 흘러내렸다."
  }
];
  window.showPrisonNightTalk = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["withdraw","insist"].includes(decisions.saifChallenge))) return false;
    const scene = document.createElement("section"); scene.className = "prison-night-talk-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","깊은 밤 서복과 사이프의 대화");
    const art = document.createElement("div"); art.className = "prison-night-talk-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-night-talk-${n}.jpg`;
      img.alt = ["깊은 밤 숙소 구석에서 마주 앉은 서복과 사이프","마음을 터놓고 이야기하는 서복과 사이프","안대가 벗겨진 사이프","사이프가 떠난 뒤 눈물을 흘리는 서복"][i];
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
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonTrunkChoice(scene,{preview}); if (!moved) busy = false; return;}
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
