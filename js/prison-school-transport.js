(() => {
  "use strict";
  const pages = [
    "그렇게 다친 사이프와 서복, 마준생은 함께 포로가 된 모건 장교와 함께 무장 대원들에게 이끌려 트럭에 올랐다.\n\n차량 행렬은 자욱한 모래 먼지를 일으키며 황량하고 절망적인 사막과 거대한 돌 아치문을 지나, 마침내 전란 깊숙한 곳에 있는 경비가 삼엄한 ‘학교’에 도착했다.",
    "운동장에는 무장 대원들이 줄지어 서 있었고, 죽은 듯한 침묵이 그들을 기다리고 있었다.\n\n서복 일행의 운명은 다시 한번 알 수 없는 심연으로 밀려들었다."
  ];
  window.showPrisonSchoolTransport = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const chili = window.storyDecisions?.chiliWater ?? saved?.chiliWater;
    const grenade = window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice;
    if (!preview && (chili !== "fake" || grenade !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-school-transport-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","학교로 향하는 포로들");
    const art = document.createElement("div"); art.className = "prison-school-transport-art";
    const images = [1,2].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-school-transport-${n}.jpg`;
      img.alt = ["사막을 가로지르는 차량 행렬","눈에 붕대를 감은 채 누워 있는 사이프"][i];
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
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonEscapePlan(scene,{preview}); if (!moved) busy = false; return;}
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
