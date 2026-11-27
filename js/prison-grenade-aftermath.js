(() => {
  "use strict";
  const explosion = "화약 연기가 자욱한 주방의 잔해 속으로 수류탄 하나가 밤공기를 가르며 날아와 발치에 굴러떨어졌다. 절체절명의 순간, 사이프는 망설임 없이 몸을 던져 수류탄을 집어 들고 밖으로 던지려 했다. 격렬한 폭발이 굉음을 내며 터졌고, 아이는 거센 충격파에 휩쓸려 날아갔다.";
  const pages = [
    {image:-1,text:explosion},
    {image:0,text:explosion},
    {image:0,text:"서복은 뜨겁게 달아오른 벽돌과 기와의 잔해 사이를 미친 듯이 기어 사이프에게 다가갔다. 피투성이가 된 아이를 품에 꼭 끌어안았다. 파편에 눈을 다친 사이프는 왼쪽 눈의 시력을 잃었다.\n\n마준생은 초조한 마음으로 다가와 생사를 알 수 없는 사이프를 불안하게 바라보았다. 서복은 떨리는 손가락을 아이의 목동맥에 가져다 댔다. 한참이 지나서야 쉰 목소리로 말했다.\n\n“살아 있어.”"},
    {image:1,text:"바로 그때, 소총을 든 미군 병사 한 명이 온몸을 경계하며 짙은 연기를 뚫고 다가왔다. 가까이 와서 서복 일행임을 알아보고서야 경계를 풀었다.\n\n그는 얼마 전 운동장에서 사이프와 함께 공을 차던 조였다. 사실 그 역시 겨우 열여섯 살인 아이에 불과했다."},
    {image:1,text:"조는 막 긴장을 풀고 아는 얼굴을 만난 미소를 지으려던 참이었다.\n\n“너였구나.”\n\n그가 나직이 중얼거리는 순간, 어둠 속에서 무자비한 총탄이 빗발쳤다. 총에 맞은 조는 피 웅덩이 속으로 쓰러졌다."}
  ];
  window.showPrisonGrenadeNextChapter = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    if (!preview && (window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice) !== "throw") return false;
    const scene = document.createElement("section"); scene.className = "prison-grenade-aftermath-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","사이프를 구한 뒤");
    const art = document.createElement("div"); art.className = "prison-grenade-aftermath-art";
    const images = [1,2].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-grenade-aftermath-${n}.jpg`;
      img.alt = ["다친 사이프를 품에 안은 서복","짙은 연기 속에서 다가온 미군 병사 조"][i];
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
      busy = true; await fade(prose,1,0,180);
      const page = pages[index]; scene.dataset.image = String(page.image); scene.dataset.step = String(index);
      if (page.image !== current) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,page.image === 0 ? 2600 : 1000);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,index === 0 ? 1400 : 400);
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonZaReunion(scene); if (!moved) busy = false; return;}
      index++; show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    document.body.append(scene); scene.focus({preventScroll:true}); if (previous) previous.remove();
    await show(); return true;
  };
})();
