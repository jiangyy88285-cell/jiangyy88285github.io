(() => {
  "use strict";
  const texts = [
    "어느덧 크리스마스가 되었다.",
    "수용소 안에는 즐겁고 따뜻한 크리스마스 음악이 울려 퍼졌다. 화려하게 장식된 명절 분위기는 차가운 감옥과 너무나도 어울리지 않았다.",
    "크리스마스트리를 꾸미던 운동장 옆에서, 트리에 달린 장식 공 하나가 사이프의 발치로 굴러왔다.",
    "젊은 미군 병사가 웃으며 사이프에게 공을 차 달라고 했다. 이내 사이프는 신이 나서 운동장에서 공을 차기 시작했다.",
    "미군 소년들은 공을 받아 내지 못했다. 한바탕 웃음소리가 공기 속으로 퍼져 나갔다. 사실 어느 편에 속해 있든, 전쟁의 포화 밖에 있는 아이들은 본래 순수하고 무고했다.",
    "실내에서는 미군 장병들이 잔을 높이 들고 크리스마스를 즐겼다. 장교의 진심 어린 축사가 공기 속에 울려 퍼졌다.\n\n“하루빨리 전쟁에서 승리하고 가족 곁으로 돌아갈 수 있기를! 메리 크리스마스!”"
  ];
  window.showPrisonChristmas = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "prison-christmas-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "수용소의 크리스마스");
    const art = document.createElement("div"); art.className = "prison-christmas-art";
    const images = texts.map((_, i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-christmas-${i + 1}.jpg`;
      img.alt = ["밤이 내려앉은 수용소", "성탄 만찬을 준비하는 두 요리사", "사이프의 발치에 굴러온 장식 공", "공을 차 달라고 손짓하는 미군 소년", "함께 공을 차며 웃는 아이들", "크리스마스 장식으로 가득한 연회장"][i];
      img.draggable = false; art.append(img); return img;
    });
    const lights = document.createElement("div"); lights.className = "prison-christmas-lights"; lights.setAttribute("aria-hidden", "true");
    const prose = document.createElement("p"); prose.setAttribute("aria-live", "polite");
    scene.append(art, lights, prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, lit = false;
    async function fade(el, from, to, duration) {
      const animation = el.animate([{opacity: from}, {opacity: to}], {duration: reduced ? 0 : duration, easing: "ease-in-out", fill: "forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose, 1, 0, 140);
      await images[index].decode(); scene.dataset.image = String(index);
      scene.dataset.phase = index === 5 ? "dark" : "story";
      images[index].style.zIndex = "1"; await fade(images[index], 0, 1, 850);
      images.forEach((img, i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = index === 5 ? "" : texts[index];
      if (index === 5) scene.setAttribute("aria-label", "클릭하여 크리스마스 불빛 켜기");
      else await fade(prose, 0, 1, 300);
      busy = false;
    }
    async function illuminate() {
      busy = true; scene.dataset.phase = "lighting";
      const animation = images[5].animate([{filter: "brightness(.20)"}, {filter: "brightness(1.12)"}], {duration: reduced ? 0 : 1200, easing: "ease-in-out", fill: "forwards"});
      await Promise.all([animation.finished, fade(lights, 0, 1, 1200)]);
      images[5].style.filter = "brightness(1.12)"; animation.cancel();
      scene.dataset.phase = "lit"; lit = true;
      scene.setAttribute("aria-label", "크리스마스의 축배"); prose.textContent = texts[5];
      await fade(prose, 0, 1, 500); busy = false;
    }
    function advance() {
      if (busy) return;
      if (lit) {busy = true; window.showPrisonChristmasUndercurrent(scene); return;}
      if (index === 5) { illuminate(); return; }
      index++; show();
    }
    scene.addEventListener("click", advance);
    scene.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll: true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
