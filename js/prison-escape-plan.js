(() => {
  "use strict";
  const pages = [
    {image:0,text:"아이들은 낡은 군복을 입고 얼굴을 가린 채 줄지어 서 있었다. 차가운 기계처럼 뜨거운 햇볕 아래에서 훈련을 받고 있었다. 높은 담장 안쪽 창문 뒤에서는 어리고 막막한 눈동자 몇 쌍이 몰래 아래를 내려다보고 있었다.\n\n호송 차량의 문이 거칠게 열렸다. 서복과 마준생, 왼쪽 눈을 크게 다쳐 시력을 잃은 사이프가 차에서 떠밀려 내려왔다. 그들은 전쟁과 세뇌로 쌓아 올린 음산한 요새 한가운데에 놓였다."},
    {image:1,date:true,text:"반년 후"},
    {image:1,text:"서복은 장을 보러 나갈 기회를 얻었다. 진열대에 놓인 감자에 싹이 난 것을 보고, 신선한 감자를 사겠다는 핑계로 뒷골목의 방에 몰래 들어갔다. 그곳에서 현지 밀입국 알선책을 만났다."},
    {image:2,text:"알선책은 서복이 모아 둔 돈을 거의 모두 받아 갔다. 저축한 돈을 사실상 다 써 버렸지만, 서복은 그만한 가치가 있다고 생각했다.\n\n알선책은 낮은 목소리로 구체적인 탈출 방법을 알려 주었다. 2주 뒤에는 현지의 금요 합동 예배가 있어, 그때는 경비와 감시가 평소만큼 엄격하지 않을 것이라고 귀띔했다."}
  ];
  window.showPrisonEscapePlan = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    if (!preview && ((window.storyDecisions?.chiliWater ?? saved?.chiliWater) !== "fake" || (window.storyDecisions?.grenadeChoice ?? saved?.grenadeChoice) !== "throw")) return false;
    const scene = document.createElement("section"); scene.className = "prison-escape-plan-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","반년 뒤의 탈출 계획");
    const art = document.createElement("div"); art.className = "prison-escape-plan-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-escape-plan-${n}.jpg`;
      img.alt = ["운동장에 줄지어 훈련받는 아이들","감자가 놓인 가게와 뒷방의 서복","탈출 경로가 표시된 지도"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180); const page = pages[index];
      scene.dataset.image = String(page.image); scene.dataset.step = String(index); scene.dataset.date = String(!!page.date);
      if (current !== page.image) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1200);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,page.date ? 1000 : 450);
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {busy = true; const moved = await window.showPrisonJamalProtection(scene,{preview}); if (!moved) busy = false; return;}
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
