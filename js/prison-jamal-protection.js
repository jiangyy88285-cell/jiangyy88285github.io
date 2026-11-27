(() => {
  "use strict";
  const pages = [
    "한편, ‘학교’ 운동장에서는 세뇌와 잔혹한 훈련이 한시도 멈추지 않았다.",
    "왼쪽 눈의 시력을 잃은 사이프는 이곳에서 다른 아이들에게 자주 괴롭힘과 따돌림을 당했다.",
    "분대장으로 발탁된 자말이 모두가 보는 앞에서 괴롭힘을 막아섰다. 빼앗겼던 작은 검은 안대를 주워 사이프의 눈에 다시 조심스럽게 씌워 주었다.\n\n장을 보고 돌아온 마준생과 서복은 마침 그 모습을 보았다. 전쟁의 소용돌이에 휘말린 두 아이를 바라보며, 두 사람의 마음에는 복잡한 감정이 뒤섞였다."
  ];
  window.showPrisonJamalProtection = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    if (!preview && ((window.storyDecisions?.chiliWater ?? saved?.chiliWater) !== "fake" || (window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice) !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-jamal-protection-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","사이프를 지켜 주는 자말");
    const art = document.createElement("div"); art.className = "prison-jamal-protection-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-jamal-protection-${n}.jpg`;
      img.alt = ["높은 담장에 둘러싸인 학교 운동장","다른 아이들에게 괴롭힘을 당하는 사이프","사이프에게 검은 안대를 돌려주는 자말"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180); await images[index].decode();
      scene.dataset.image = String(index); images[index].style.zIndex = "1";
      await fade(images[index],0,1,1200);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = pages[index]; await fade(prose,0,1,450);
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonMorganTrial(scene,{preview}); if (!moved) busy = false; return;}
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
