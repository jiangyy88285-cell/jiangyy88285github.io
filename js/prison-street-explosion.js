(() => {
  "use strict";
  const text = "암호 입력이 끝나는 바로 그 순간, 거리에 거대한 폭발이 일어났다!\n\n뜨거운 불길이 솟구치고 짙은 연기가 하늘을 뒤덮었다. 거센 충격파가 순식간에 거리 전체를 휩쓸었다. 수많은 무고한 민간인이 불길과 연기 속에서 비명을 지르며 쓰러졌다.\n\n짐칸의 좁은 틈에 웅크린 사이프는 이 참혹한 광경을 두 눈으로 목격했다. 어린 마음은 감당할 수 없는 충격에 무너져 내렸다.";
  window.showPrisonStreetExplosion = async (previous = null, {preview = false} = {}) => {
    let saved = {}; try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || decisions.saifTrunk !== "hide")) return false;
    const scene = document.createElement("section"); scene.className = "prison-street-explosion-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","거리의 폭발을 목격한 사이프");
    const art = document.createElement("div"); art.className = "prison-street-explosion-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-street-explosion-${n}.jpg`;
      img.alt = ["거리 위로 치솟는 거대한 연기 기둥","불길과 함께 솟구치는 폭발의 연기","도시를 뒤덮는 짙은 연기","폭발로 파괴된 거리를 내려다본 모습"][i];
      img.draggable = false; art.append(img); return img;
    });
    const smoke = document.createElement("img"); smoke.className = "street-explosion-smoke"; smoke.alt = ""; smoke.setAttribute("aria-hidden","true"); art.append(smoke);
    const rollingSmoke = document.createElement("img"); rollingSmoke.className = "street-explosion-smoke street-explosion-smoke-back"; rollingSmoke.alt = ""; rollingSmoke.setAttribute("aria-hidden","true"); art.append(rollingSmoke);
    const fire = document.createElement("div"); fire.className = "street-explosion-fire"; art.append(fire);
    const flames = Array.from({length:9},(_,i) => {
      const flame = document.createElement("span"); flame.className = "street-explosion-flame";
      flame.style.left = `${38+i*2.8}%`; flame.style.width = `${2.3+(i%3)*1.1}%`;
      flame.style.height = `${7+(i%4)*2.2}%`; fire.append(flame); return flame;
    });
    const embers = Array.from({length:14},(_,i) => {
      const ember = document.createElement("span"); ember.className = "street-explosion-ember";
      ember.style.left = `${35+(i*7)%31}%`; ember.style.width = `${2+i%3}px`;
      ember.style.height = `${3+i%4}px`; fire.append(ember); return ember;
    });
    const prose = document.createElement("p"); prose.textContent = text; scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effects = []; let busy = true;
    const pause = ms => reduced ? Promise.resolve() : new Promise(resolve => setTimeout(resolve,ms));
    async function fade(el,from,to,ms) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : ms,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show(n) {
      const incoming = images[n]; incoming.style.zIndex = "1";
      await fade(incoming,0,1,500);
      images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";});
      smoke.src = incoming.src; rollingSmoke.src = incoming.src; scene.dataset.image = String(n);
    }
    async function advance() {
      if (busy) return;
      if (scene.dataset.phase === "complete" && typeof window.showPrisonChildrenRescue === "function") {
        busy = true; const moved = await window.showPrisonChildrenRescue(scene,"hide",{preview});
        if (!moved) busy = false; return;
      }
      if (scene.dataset.phase !== "awaiting-click") return;
      busy = true; scene.dataset.phase = "aftermath";
      effects.forEach(animation => animation.cancel()); smoke.style.opacity = "0"; rollingSmoke.style.opacity = "0"; fire.style.opacity = "0";
      await fade(prose,1,0,250); prose.textContent = ""; await show(3);
      smoke.style.opacity = "0"; scene.dataset.phase = "complete"; busy = false;
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await Promise.all(images.map(img => img.decode())); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); scene.dataset.phase = "exploding";
    if (!reduced) {
      effects.push(smoke.animate([
        {transform:"translate(-3px,8px) scale(1.025)",opacity:0.12,filter:"blur(1px)"},
        {transform:"translate(8px,-17px) scale(1.065)",opacity:0.43,filter:"blur(2px)"},
        {transform:"translate(-5px,-38px) scale(1.105)",opacity:0.03,filter:"blur(4px)"}
      ],{duration:2400,iterations:Infinity,easing:"ease-out"}));
      effects.push(rollingSmoke.animate([
        {transform:"translate(7px,9px) scale(1.035)",opacity:0.06,filter:"blur(3px)"},
        {transform:"translate(-11px,-22px) scale(1.09)",opacity:0.32,filter:"blur(5px)"},
        {transform:"translate(5px,-47px) scale(1.15)",opacity:0.02,filter:"blur(7px)"}
      ],{duration:3300,iterations:Infinity,delay:-1500,easing:"ease-out"}));
      flames.forEach((flame,i) => effects.push(flame.animate([
        {transform:"translateY(8px) rotate(-9deg) scale(0.65,0.7)",opacity:0.05},
        {transform:"translateY(-8px) rotate(8deg) scale(1.05,1.25)",opacity:0.9,offset:0.38},
        {transform:"translateY(-27px) rotate(-5deg) scale(0.55,1.5)",opacity:0.48,offset:0.7},
        {transform:"translateY(-48px) rotate(10deg) scale(0.2,0.7)",opacity:0}
      ],{duration:1050+i*87,iterations:Infinity,delay:-i*173,easing:"ease-out"})));
      embers.forEach((ember,i) => effects.push(ember.animate([
        {transform:"translate(0,0)",opacity:0},
        {transform:`translate(${(i%2 ? -1 : 1)*12}px,-24px)`,opacity:0.85,offset:0.18},
        {transform:`translate(${(i%2 ? -1 : 1)*(22+i*3)}px,${-95-i*8}px)`,opacity:0}
      ],{duration:1500+i*103,iterations:Infinity,delay:-i*197,easing:"ease-out"})));
      effects.push(fire.animate([{opacity:0.28},{opacity:0.65,offset:0.32},{opacity:0.38,offset:0.55},{opacity:0.58,offset:0.8},{opacity:0.28}],{duration:1150,iterations:Infinity,easing:"ease-in-out"}));
    }
    const shake = scene.animate([
      {transform:"translate(-50%,-50%)"},
      {transform:"translate(calc(-50% - 3px),calc(-50% + 2px)) rotate(-0.12deg)"},
      {transform:"translate(calc(-50% + 3px),calc(-50% - 2px)) rotate(0.12deg)"},
      {transform:"translate(calc(-50% - 2px),calc(-50% - 1px))"},
      {transform:"translate(calc(-50% + 1px),calc(-50% + 1px))"},
      {transform:"translate(-50%,-50%)"}
    ],{duration:reduced ? 0 : 850,iterations:reduced ? 1 : 7,easing:"ease-in-out"});
    const shaken = shake.finished.then(() => shake.cancel());
    await show(0); await pause(2200); await show(1); await pause(1700); await show(2);
    await shaken; scene.dataset.phase = "awaiting-click"; busy = false; return true;
  };
})();
