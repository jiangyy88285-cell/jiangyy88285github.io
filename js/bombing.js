(() => {
  "use strict";
  const lines = [
    "잠들어 있던 서복이 화들짝 깨어났다. 비몽사몽간에 옆에 있던 마준생을 툭툭 밀었다.\n“지진인가?”\n마준생은 눈을 비비며 중얼거렸다.\n“그런가 보네…… 그럼 내려가야지. 아래층으로 내려가자.”",
    "두 사람은 허둥지둥 옷을 입기 시작했다.\n그러나 창밖의 굉음은 점점 잦아졌고, 진동은 더욱 거세졌다. 건물의 벽돌과 돌조각이 지붕 위로 쏟아지며 날카로운 소리를 냈다.",
    "서복의 움직임이 멈췄다. 그의 눈에 순식간에 극심한 공포가 차올랐다.\n“빨리! 빨리 뛰어!”\n말이 채 끝나기도 전에—"
];
  window.showBombing = (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "bombing-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.dataset.stage = "clock";
    scene.setAttribute("aria-label", "새벽 5시 33분, 점점 커지는 진동");
    scene.innerHTML = '<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><filter id="bombing-red-clock" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 .12 0 0 0 0 .035 6 -3 -2 0 -.1"/></filter></defs></svg><div class="bombing-world"><img class="bombing-clock" src="../js/images/bombing-clock.jpg" alt="붉은 시계 숫자 5:33" draggable="false"><img class="bombing-room" src="../js/images/bombing-room.png" alt="진동에 놀라 잠에서 깬 서복과 마준생" draggable="false"><img class="bombing-clock-glow" src="../js/images/bombing-clock.jpg" alt="" aria-hidden="true" draggable="false"></div><p class="bombing-prose" aria-live="polite"></p><div class="bombing-blackout"></div><p class="bombing-final" aria-live="polite"></p>';
    const world = scene.querySelector(".bombing-world"), clock = scene.querySelector(".bombing-clock");
    const room = scene.querySelector(".bombing-room"), prose = scene.querySelector(".bombing-prose");
    const blackout = scene.querySelector(".bombing-blackout"), final = scene.querySelector(".bombing-final");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let busy = true, index = -1, raf = 0, started = performance.now();
    const fade = (element,from,to,duration) => element.animate([{opacity:from},{opacity:to}],
      {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"}).finished;
    function shake(now) {
      if (!scene.isConnected || scene.dataset.stage === "end") return;
      const elapsed = (now - started) / 1000;
      const progress = scene.dataset.stage === "blast" ? 1 : Math.min(.8, .025 + elapsed / 100 + Math.max(index,0) / (lines.length - 1) * .52);
      const amplitude = Math.min(scene.clientWidth * .012, 6) * progress;
      const rate = 3 + progress * 5;
      const x = (Math.sin(elapsed * rate * 2.1) + Math.sin(elapsed * rate * 3.7) * .35) * amplitude * .7;
      const y = Math.sin(elapsed * rate * 2.8) * amplitude * .65;
      world.style.transform = `translate(${x}px,${y}px) rotate(${Math.sin(elapsed*rate)*progress*.12}deg) scale(1.14)`;
      raf = requestAnimationFrame(shake);
    }
    async function explode() {
      busy = true; await fade(prose,1,0,250);
      scene.dataset.stage = "blast"; prose.textContent = "“쾅—!!”";
      await fade(prose,0,1,450);
      await fade(blackout,0,1,1600);
      scene.dataset.stage = "end"; cancelAnimationFrame(raf);
      world.style.transform = "scale(1.14)"; prose.textContent = "";
      final.textContent = "전쟁이, 마침내 시작되었다.";
      await fade(final,0,1,1600);
      scene.setAttribute("aria-label", final.textContent);
      await new Promise(resolve=>setTimeout(resolve,reduced?0:1800));
      window.showAftermath(scene);
    }
    async function advance() {
      if (busy || scene.dataset.stage === "end") return;
      if (index === lines.length - 1) {await explode();return;}
      busy = true; await fade(prose,1,0,160);
      index++;
      if (index === 0) {
        await room.decode();
        scene.dataset.stage = "room";
        await fade(room,0,1,1300);
        // The room stays opaque before the clock is removed from view.
        clock.style.visibility = "hidden";
      }
      prose.textContent = lines[index]; await fade(prose,0,1,350);
      busy = false;
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{
      if(event.altKey || event.ctrlKey || event.metaKey) return;
      if(event.code === "Space" || event.key === "Enter") {event.preventDefault();advance();}
    });
    prose.style.opacity = 0;
    document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove();
    clock.decode().then(async()=>{
      await fade(clock,0,1,1200);
      started = performance.now(); if(!reduced) raf = requestAnimationFrame(shake);
      prose.textContent = "쿵…… 쿵…… 쿵……";
      await fade(prose,0,1,900); busy = false;
    });
  };
})();
