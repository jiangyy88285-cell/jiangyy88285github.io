(() => {
  "use strict";
  const pages = [
    "잔해와 극심한 통증 속에서 서복은 마준생의 다급한 손길에 깨어났다. 힘겹게 눈을 뜨자 온통 폐허와 치솟는 불길이 보였다. 조금 전까지 크리스마스 장식으로 빛나던 수용소는 눈 깜짝할 사이 피와 살이 튀는 지옥으로 변해 있었다.",
    "마준생은 서복과 사이프를 잡아 일으켰다. 얼굴이 새하얗게 질린 채 소리쳤다.\n\n“누가 쳐들어왔어! 이제 집에 못 가! 빨리 도망쳐!”",
    "혼란과 빗발치는 총탄 속에서 세 사람은 피란하는 군중에 섞여 미친 듯이 앞으로 달렸다. 앞쪽의 시커먼 총구가 갑자기 그들을 겨누었다.\n\n서복은 본능적으로 두 팔을 벌려 사이프를 뒤로 감싸며 목이 터져라 외쳤다.\n\n“우리는 중국인이오! 쏘지 마시오! 우리는 중국인이오!”",
    "그러나 광기와 증오에 삼켜진 전쟁의 안개 속에서, 목숨을 구하려는 그 외침은 아무런 소용이 없었다. 차가운 총탄은 여전히 무자비하게 그들을 향해 날아들었다……"
  ];
  window.showPrisonEscape = async (previous = null) => {
    const scene = document.createElement("section"); scene.className = "prison-escape-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.dataset.image = "-1"; scene.dataset.phase = "calling";
    scene.setAttribute("aria-label", "폐허 속에서의 탈출");
    const art = document.createElement("div"); art.className = "prison-escape-art";
    const images = pages.map((_,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-escape-${i + 1}.jpg`;
      img.alt = ["잔해 위에 쓰러진 서복", "불길에 휩싸인 수용소와 도망치는 사람들", "군중 속에서 사이프를 데리고 달리는 일행", "총탄과 연기 속을 달리는 사람들"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live", "polite");
    prose.textContent = "“서 형! 스승님……!”"; prose.style.opacity = "0"; scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = -1, busy = true;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,240); await images[index].decode();
      scene.dataset.image = String(index); scene.dataset.phase = index === 0 ? "waking" : "escape";
      images[index].style.zIndex = "1"; await fade(images[index],0,1,index === 0 ? 2400 : 850);
      images.forEach((img,i) => {img.style.opacity = i === index ? "1" : "0"; img.style.zIndex = "0";});
      prose.textContent = pages[index]; await fade(prose,0,1,450);
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    function advance() {if (busy) return; if (index === pages.length - 1) {busy = true; window.showPrisonGrenade(scene); return;} index++; show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    document.body.append(scene); scene.focus({preventScroll:true}); if (previous) previous.remove();
    await fade(prose,0,1,800); busy = false; return true;
  };
})();
