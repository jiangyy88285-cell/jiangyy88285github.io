(() => {
  "use strict";
  const pages = [
    "이어서 교장은 훈련받는 아이들을 바라보며 최근의 훈련 성과가 아주 훌륭하다고 흡족하게 선언했다. 가장 뛰어난 전사 한 명을 뽑아 전선에 보내겠다고 했다.\n\n오늘의 마지막 시험은 포로로 잡힌 이 미군을 직접 죽이는 것이었다. 그 미군은 바로 모건 장교였다.",
    "그 미군은 바로 모건 장교였다.",
    "",
    "",
    "사이프는 창가에 서서 아래 운동장에서 벌어지는 모든 일을 뚫어지게 바라보고 있었다. 예전에 모건이 서복과 마준생을 무참히 때렸던 일을 떠올리자, 마음속에서 분노가 치밀어 올랐다.\n\n“그만 보고 일하러 가.” 뒤에서 서복이 재촉했다."
  ];
  window.showPrisonMorganTrial = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    if (!preview && ((window.storyDecisions?.chiliWater ?? saved?.chiliWater) !== "fake" || (window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice) !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-morgan-trial-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","교장의 마지막 시험과 모건");
    const art = document.createElement("div"); art.className = "prison-morgan-trial-art";
    const images = pages.map((_,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-morgan-trial-${i + 1}.jpg`;
      img.alt = ["포로가 된 모건의 발과 주변 경비병들","수염이 자라고 상처 입은 모건","군복을 입고 있던 모건의 모습","고개를 숙인 모건","창가에서 운동장을 바라보는 사이프"][i];
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
      busy = true;
      const quick = index >= 1 && index <= 3;
      if (!quick) await fade(prose,1,0,140);
      else prose.style.opacity = "0";
      await images[index].decode(); scene.dataset.image = String(index);
      if (quick) {
        // Click-driven hard cuts: no pan, zoom, flicker loop, or queued advance.
        images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0";});
      } else {
        images[index].style.zIndex = "1"; await fade(images[index],0,1,1000);
        images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      }
      prose.textContent = pages[index];
      if (pages[index]) {
        if (quick) prose.style.opacity = "1";
        else await fade(prose,0,1,350);
      }
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonSaifChallenge(scene,{preview}); if (!moved) busy = false; return;}
      index++; show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    // Decode the montage before enabling clicks so its hard cuts stay immediate.
    await Promise.all(images.map(img => img.decode()));
    document.body.append(scene); scene.focus({preventScroll:true}); if (previous) previous.remove();
    await show(); return true;
  };
})();
