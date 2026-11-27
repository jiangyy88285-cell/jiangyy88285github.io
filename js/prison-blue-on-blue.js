(() => {
  "use strict";
  const texts = [
    "Blue on blue—아군 간의 전쟁",
    "한밤중에 갑자기 총성이 터져 나오고, 사방에 화약 연기가 피어올랐다!",
    "이것은 결코 오인 사격이 아니었다. 처음 들이닥친 자들은 아군이 아니라, 미군 군복으로 위장해 잠입한 테러리스트들이었다!",
    "곧이어 하늘에서 날카로운 굉음이 울렸다. 미사일 한 발이 수용소 한가운데를 정확히 겨냥해 내리꽂혔다!\n\n천지를 뒤흔드는 폭음과 함께 충격파가 순식간에 지붕을 날려 버렸다. 뜨거운 불길이 주방 전체를 집어삼켰다.",
    "서복은 눈앞이 캄캄해졌다. 폭발에 휩쓸린 그는 그대로 쓰러져 의식을 잃었다."
  ];
  window.showPrisonBlueOnBlue = async (previous = null) => {
    const scene = document.createElement("section"); scene.className = "prison-blue-on-blue-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label", "Blue on blue");
    const art = document.createElement("div"); art.className = "prison-blue-on-blue-art";
    const images = texts.map((_,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-blue-on-blue-${i + 1}.jpg`;
      img.alt = ["수갑을 찬 손에 들린 크리스마스트리 그림", "창밖의 습격을 바라보는 서복", "위장한 습격자들과 수용소의 폭발", "폭발로 무너지는 주방", "충격에 쓰러지는 서복"][i];
      img.draggable = false; art.append(img); return img;
    });
    const darkness = document.createElement("div"); darkness.className = "prison-blue-on-blue-darkness"; darkness.setAttribute("aria-hidden", "true");
    const prose = document.createElement("p"); prose.setAttribute("aria-live", "polite"); scene.append(art,darkness,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, titleShown = false, tremor = null;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    function shake() {
      if (reduced) return;
      tremor = art.animate([
        {transform:"translate(0,0)"},{transform:"translate(-9px,6px) rotate(-.4deg)"},
        {transform:"translate(8px,-7px) rotate(.5deg)"},{transform:"translate(-6px,-3px)"},
        {transform:"translate(7px,7px) rotate(-.3deg)"},{transform:"translate(0,0)"}
      ],{duration:260,iterations:Infinity});
    }
    async function collapse() {
      scene.dataset.phase = "falling";
      const motion = images[4].animate([
        {transform:"scale(1.06) translateY(0) rotate(0deg)"},
        {transform:"scale(1.18) translateY(14%) rotate(7deg)"}
      ],{duration:reduced ? 0 : 1400,easing:"cubic-bezier(.4,0,.9,.5)",fill:"forwards"});
      await motion.finished;
      images[4].style.transform = "scale(1.18) translateY(14%) rotate(7deg)"; motion.cancel();
      await Promise.all([fade(darkness,0,1,1800),fade(prose,1,0,900)]);
      if (tremor) {tremor.cancel(); tremor = null;}
      scene.dataset.phase = "unconscious";
      await window.showPrisonEscape(scene);
    }
    async function show() {
      busy = true; await fade(prose,1,0,140);
      if (tremor) {tremor.cancel(); tremor = null;}
      await images[index].decode(); scene.dataset.image = String(index);
      scene.dataset.phase = index === 0 ? "await-title" : "story";
      images[index].style.zIndex = "1";
      if (index >= 3) shake();
      await fade(images[index],0,1,index >= 3 ? 220 : 700);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = index === 0 ? "" : texts[index];
      if (index !== 0) await fade(prose,0,1,300);
      if (index === 4) {await collapse(); return;}
      busy = false;
    }
    async function revealTitle() {
      busy = true; scene.dataset.phase = "title-reveal"; prose.textContent = texts[0];
      await fade(prose,0,1,2600); titleShown = true; scene.dataset.phase = "title"; busy = false;
    }
    function advance() {
      if (busy || index === texts.length - 1) return;
      if (index === 0 && !titleShown) {revealTitle(); return;}
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
