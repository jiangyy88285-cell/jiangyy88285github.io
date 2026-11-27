(() => {
  "use strict";
  const pages = [
    {image:0,text:"“제가 하겠습니다.”\n\n사람들 사이에서 손을 높이 든 아이는 바로 자말이었다."},
    {image:1,text:"교장은 웃으며 자말을 앞으로 불러 어깨를 두드렸다.\n“용감한 아이로구나.”\n\n그는 묵직한 권총을 자말의 손에 쥐여 주었다. 모든 아이가 보는 앞에서 이 미군을 직접 죽이라고 했다. 그것이 ‘졸업’을 위한 마지막 시험이자, 부모의 원수를 갚는 의식이었다."},
    {image:1,text:"“너를 알아.”\n\n땅에 무릎을 꿇은 모건이 천천히 고개를 들었다. 눈앞에서 총을 든 아이를 알아보고 힘없이 중얼거렸다.\n\n“전에 욕실을 청소하던 그 꼬마 새끼로군.”"},
    {image:2,text:"교장은 반동에 떨리는 자말의 총구를 손으로 붙들어 안정시켰다. 아이의 귀에 대고 낮게 속삭였다.\n\n“얘야…… 네 부모는 미국인들 때문에 죽었다. 부모의 원수를 갚아라! 끝내 버려.”"},
    {image:3,text:"말이 채 끝나기도 전에, ‘탕!’ 하는 둔탁한 총성이 적막을 갈랐다. 총알은 순식간에 모건의 목을 관통했고, 피가 샘처럼 솟구쳤다. 모건은 두 손으로 목을 움켜쥔 채 땅바닥에서 고통스럽게 경련했다."},
    {image:4,text:"“용감한 전사를 위해 환호하라!”\n교장이 모두를 향해 소리쳤다.\n“자말!”\n\n그 말이 떨어지자 운동장에 줄지어 선 아이들이 총을 치켜들었다. 광적인 환호가 터져 나왔다."}
  ];
  // Both responses to Saif's challenge lead to this same chapter.
  window.showPrisonSaifChallengeOutcome = async (previous = null, choice = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    const response = choice ?? decisions.saifChallenge;
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["withdraw","insist"].includes(response))) return false;
    const scene = document.createElement("section"); scene.className = "prison-jamal-trial-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","먼저 나선 자말의 시험");
    const art = document.createElement("div"); art.className = "prison-jamal-trial-art";
    const images = [1,2,3,4,5].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-jamal-trial-${n}.jpg`;
      img.alt = ["손을 높이 든 자말","자말을 앞으로 부른 교장","자말의 총을 붙들어 주는 교장의 손","목을 다쳐 쓰러진 모건","총을 들고 환호하는 아이들"][i];
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
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonNightTalk(scene,{preview}); if (!moved) busy = false; return;}
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
