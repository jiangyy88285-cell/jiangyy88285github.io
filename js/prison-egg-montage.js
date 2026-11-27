(() => {
  "use strict";
  window.showPrisonEggMontage = async (previous = null, {preview = false} = {}) => {
    let saved = {}; try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk))) return false;
    const scene = document.createElement("section"); scene.className = "prison-egg-montage-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","서서히 타들어 가는 달걀");
    const art = document.createElement("div"); art.className = "prison-egg-montage-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-egg-montage-${n}.jpg`;
      img.alt = ["팬 위에서 익기 시작하는 달걀","가장자리가 갈색으로 타들어 가는 달걀","기름 거품 속에서 까맣게 타는 달걀","팬 한가운데 남은 새까맣게 탄 달걀"][i];
      img.draggable = false; art.append(img); return img;
    });
    const heat = document.createElement("div"); heat.className = "egg-browning"; art.append(heat);
    const bubbles = Array.from({length:14},(_,i) => {
      const dot = document.createElement("span"); dot.className = "egg-oil-bubble";
      dot.style.left = `${24+(i*13)%55}%`; dot.style.top = `${53+(i*7)%31}%`;
      dot.style.width = dot.style.height = `${3+i%4}px`; art.append(dot); return dot;
    });
    const steam = Array.from({length:4},(_,i) => {
      const wisp = document.createElement("span"); wisp.className = "egg-steam"; wisp.style.left = `${36+i*8}%`; art.append(wisp); return wisp;
    });
    const prose = document.createElement("p"); prose.textContent = "그 후, 어린 생명들이 하나둘 소리 없는 잔혹함 속에서 스러져 갔다."; scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effects = []; let busy = true, sound = null;
    try {sound = new Audio("../js/audio/prison-egg-sizzle.wav"); sound.loop = true; sound.volume = 0.24;} catch {}
    function startSound() {if (sound && busy) sound.play().catch(() => {});}
    function stopSound() {if (sound) {sound.pause(); sound.currentTime = 0;}}
    startSound(); window.addEventListener("pagehide",stopSound,{once:true});
    const pause = ms => reduced ? Promise.resolve() : new Promise(resolve => setTimeout(resolve,ms));
    async function fade(el,ms) {
      const animation = el.animate([{opacity:0},{opacity:1}],{duration:reduced ? 0 : ms,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = "1"; animation.cancel();
    }
    async function advance() {
      startSound();
      if (busy) return;
      if (typeof window.showPrisonEggNextChapter === "function") {
        busy = true; const moved = await window.showPrisonEggNextChapter(scene,{preview}); if (!moved) busy = false;
      }
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    try {await Promise.all(images.map(img => img.decode()));} catch (error) {stopSound(); throw error;}
    document.body.append(scene); scene.focus({preventScroll:true}); if (previous) previous.remove();
    scene.dataset.phase = "cooking";
    if (!reduced) {
      bubbles.forEach((dot,i) => effects.push(dot.animate([
        {transform:"scale(0.3)",opacity:0}, {transform:"scale(2)",opacity:0.6,offset:0.55}, {transform:"scale(2.8)",opacity:0}
      ],{duration:700+i*67,iterations:Infinity,delay:-i*151,easing:"ease-out"})));
      steam.forEach((wisp,i) => effects.push(wisp.animate([
        {transform:"translate(0,0) scale(0.6)",opacity:0},
        {transform:"translate(8px,-35px) scale(1)",opacity:0.18,offset:0.4},
        {transform:"translate(-12px,-100px) scale(1.4)",opacity:0}
      ],{duration:3200+i*250,iterations:Infinity,delay:-i*800,easing:"ease-out"})));
      effects.push(heat.animate([{opacity:0},{opacity:0.26},{opacity:0.08}],{duration:12000,fill:"forwards",easing:"ease-in-out"}));
    }
    for (let i = 0; i < images.length; i++) {
      if (i > 0) prose.textContent = "";
      const incoming = images[i]; incoming.style.zIndex = "1";
      await fade(incoming,i === 0 ? 650 : 3300);
      images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";});
      scene.dataset.image = String(i); await pause(i === 0 ? 1800 : 800);
    }
    effects.forEach(animation => animation.cancel()); heat.style.opacity = "0";
    bubbles.forEach(dot => {dot.style.opacity = "0";}); steam.forEach(wisp => {wisp.style.opacity = "0";});
    stopSound(); scene.dataset.phase = "complete"; busy = false; return true;
  };
})();
