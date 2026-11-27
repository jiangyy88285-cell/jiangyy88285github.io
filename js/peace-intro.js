(() => {
  "use strict";
  const revealButton = document.getElementById("menu-reveal");
  const scene = document.getElementById("scene");
  if (!revealButton || !scene) return;
  const words = ["평화", "평온", "안녕", "희망", "고향", "귀향", "다정함", "온기", "화해", "자유", "안전", "일상", "이해", "포용", "존중", "동행", "사랑", "우정", "평등", "선의", "신뢰", "안정", "보금자리", "미소", "포옹", "재회", "빛", "공존", "고요", "경청", "자비", "내일", "연대", "생명", "밥", "봄", "꿈", "햇살", "행복", "이웃", "배려", "용서", "나눔", "위로", "쉼", "웃음", "약속", "함께", "소망", "따뜻함"];
  let layer = null, leaving = false, bypass = false;
  revealButton.addEventListener("click", event => {
    if (bypass) { bypass = false; return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (leaving) return;
    if (layer) {
      leaving = true;
      const closing = layer;
      const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1000;
      const animations = [...closing.querySelectorAll(".peace-word")].map(word => {
        const current = getComputedStyle(word);
        const from = {opacity: current.opacity, transform: current.transform};
        word.getAnimations().forEach(animation => animation.cancel());
        return word.animate([from, {opacity: 0, transform: `rotate(${word.style.getPropertyValue("--tilt")}) scale(.15)`}],
          {duration, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards"}).finished;
      });
      Promise.all(animations).then(() => {
        if (layer !== closing) return;
        closing.remove(); layer = null; leaving = false;
        bypass = true; revealButton.click();
      }).catch(() => {});
      return;
    }
    layer = document.createElement("div");
    layer.className = "peace-intro";
    layer.setAttribute("aria-hidden", "true");
    const field = document.createElement("span");
    field.className = "peace-words";
    field.setAttribute("aria-hidden", "true");
    const placed = [];
    const width = scene.clientWidth * .92, height = scene.clientHeight * .84;
    words.forEach(text => {
      const word = document.createElement("span");
      word.className = "peace-word";
      word.textContent = text;
      const size = 1.4 + Math.pow(Math.random(), 1.5) * 3.6;
      const font = Math.max(9, Math.min(54, width * size / 100));
      const w = Math.min(.92, (text.length * font + 14) / width);
      const h = (font * 1.6 + 8) / height;
      let x, y;
      for (let attempt = 0; attempt < 150; attempt++) {
        x = Math.random() * (1 - w);
        y = Math.random() * Math.max(0, 1 - h);
        if (!placed.some(p => x < p.x + p.w && x + w > p.x && y < p.y + p.h && y + h > p.y)) break;
      }
      placed.push({x, y, w, h});
      word.style.left = `${x * 100}%`;
      word.style.top = `${y * 100}%`;
      word.style.setProperty("--size", `${size}cqw`);
      word.style.setProperty("--tilt", `${Math.random() * 30 - 15}deg`);
      word.style.setProperty("--delay", `${Math.random() * 1.5}s`);
      word.style.setProperty("--ink", `${.35 + Math.random() * .44}`);
      field.append(word);
    });
    layer.append(field);
    scene.append(layer);
    revealButton.setAttribute("aria-label", "再次点击，显示游戏开始菜单");
  }, true);
  document.getElementById("replay").addEventListener("click", () => {
    if (layer) { layer.remove(); layer = null; }
    leaving = false; bypass = false;
    revealButton.setAttribute("aria-label", "点击画面，浮现和平词语");
  });
})();
