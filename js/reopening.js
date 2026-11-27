(() => {
  "use strict";
  const steps = [
    [0, "집으로 돌아갈 수 없는 날들이 이어지는 동안에도, 서복은 용식당에서 아이들에게 먹을 것을 나눠 주었다. 점심때가 되자 며칠째 모습을 감췄던 사장 자이드가 돌아왔다. 그는 서복과 마준생을 폐허 속에 마련한 간이 식탁으로 데려갔다."],
    [1, "“이럴 때일수록 사람들에게는 따뜻한 한 끼가 더 절실해요. 장사는 전보다 더 잘될 거고, 돈도 더 벌 수 있죠.”\n자이드는 서복을 바라보며 한 달에 3만 위안의 보수를 제시했다."],
    [1, "서복은 자이드를 흘끗 보더니 곧바로 계산을 해 보았다.\n“한 달 순이익이 30만 위안인데, 3만 위안으로 내 목숨을 사겠다고요? 부족해요.”\n자이드는 웃음을 터뜨렸다. “계산이 꽤 빠르군요.”\n“당신만 사장 해 봤어요? 나도 예전엔 사장이었어요.” 서복이 퉁명스럽게 받아쳤다."],
    [1, "자이드는 뜻을 알겠다는 듯 고개를 끄덕이며 그의 요구를 받아들였다. 안전 구역 안에 자리를 마련해 주고, 그곳에서 안심하고 일을 계속할 수 있게 했다. 서복은 하루라도 빨리 빚을 갚고 큰돈을 벌기 위해 이를 악물고 남기로 했다."],
    [1, "한편 자이드는 자드라는 현지 암시장 상인과도 손을 잡았다. 딸의 결혼 피로연 준비가 급했던 자드가 소식을 듣고 찾아왔다.\n“음식만 잘 만들어 주면, 앞으로 물과 식재료는 내가 전부 대겠소.”\n전쟁으로 물자가 극도로 부족해진 상황에서, 이 약속은 식당이 다시 자리를 잡는 든든한 토대가 되었다."],
    [2, "고아원 아이들은 용식당에서 종업원으로 일하기 시작했다. 이곳은 아이들에게 일자리를 주었을 뿐 아니라, 비바람을 피하고 따뜻하게 입고 배불리 먹을 수 있는 새로운 집이 되었다."]
  ];
  window.showReopening = (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "reopening-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "다시 문을 연 용식당");
    scene.innerHTML = '<div class="reopening-art"><img src="../js/images/reopening-children.jpg" alt="용식당을 찾아온 아이들" draggable="false"><img src="../js/images/reopening-negotiation.jpg" alt="간이 식탁에서 이야기를 나누는 세 사람" draggable="false"><img src="../js/images/reopening-family.jpg" alt="용식당의 새 가족이 된 아이들" draggable="false"></div><div class="reopening-wash"></div><p class="reopening-prose" aria-live="polite"></p>';
    const images = scene.querySelectorAll("img"), prose = scene.querySelector("p");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, busy = true, current = null;
    async function fade(element, from, to, duration) {
      const animation = element.animate([{opacity:from},{opacity:to}], {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; element.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose, 1, 0, 160);
      const [imageIndex, text] = steps[index], incoming = images[imageIndex];
      if (current !== incoming) {
        await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming, 0, 1, 1000);
        images.forEach(image => {image.style.opacity = image === incoming ? "1" : "0"; image.style.zIndex = "0";});
        current = incoming;
      }
      scene.dataset.image = imageIndex; prose.textContent = text;
      await fade(prose, 0, 1, 300); busy = false;
      if (index === steps.length - 1) scene.classList.add("is-complete");
    }
    function advance() {if (busy) return; if (index === steps.length - 1) {busy=true;window.showWedding(scene);return;} index++; show();}
    scene.addEventListener("click", advance);
    scene.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.code === "Space" || event.key === "Enter") {event.preventDefault(); advance();}
    });
    document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove();
    show();
  };
})();
