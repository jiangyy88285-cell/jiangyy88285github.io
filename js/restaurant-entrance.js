(() => {
  "use strict";
  window.showRestaurantEntrance = () => new Promise(resolve => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = document.createElement("button");
    scene.type = "button";
    scene.className = "restaurant-entrance";
    scene.setAttribute("aria-label", "点击画面，浮现龙餐馆标题");
    const image = document.createElement("img");
    image.alt = "蓝白拼贴画：龙餐馆门前的灯笼、人物与货车";
    image.draggable = false;
    const title = document.createElement("span");
    title.className = "restaurant-entrance-title";
    title.innerHTML = '<span lang="ko">용식당</span><small lang="en">Dragon Restaurant</small>';
    title.setAttribute("aria-hidden", "true");
    scene.append(image, title); document.body.append(scene);
    scene.focus({preventScroll: true});
    let phase = "entering";
    const fade = (element, from, to, duration) => element.animate(
      [{opacity: from}, {opacity: to}],
      {duration: reduced ? 0 : duration, easing: "ease-in-out", fill: "forwards"}
    ).finished;
    image.onload = async () => {
      await fade(image, 0, 1, 1800);
      phase = "picture";
    };
    image.onerror = () => { scene.setAttribute("aria-label", "图片加载失败，请刷新页面重试"); };
    image.src = "../js/images/restaurant-entrance.jpg";
    scene.addEventListener("click", async () => {
      if (phase === "picture") {
        phase = "revealing";
        title.removeAttribute("aria-hidden");
        await fade(title, 0, 1, 1800);
        phase = "title";
        scene.setAttribute("aria-label", "龙餐馆，点击继续原有故事");
      } else if (phase === "title") {
        phase = "leaving";
        window.showRestaurantTasting();
        scene.remove();
      }
    });
  });
})();
