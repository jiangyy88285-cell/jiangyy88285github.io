(() => {
  "use strict";
  const pages = [
    {image:0, text:"그러나 평화로운 명절 분위기 아래에서는 어두운 움직임이 조용히 일고 있었다. 갇혀 있던 ‘교장’은 어두운 구석에서 동료가 몰래 건네준 비밀 쪽지를 펼쳤다."},
    {image:1, text:"그때 모건 장교가 천천히 서복 곁으로 와 앉더니 불쑥 물었다.\n“네 미친 아들은 어디 있지?”\n\n서복은 그를 똑바로 바라보았다.\n“일하고 있습니다.”\n\n모건은 차가운 눈빛으로 음산하게 말했다.\n“제법이더군. 날 죽일 뻔했어.”"},
    {image:1, text:"서복은 감정을 억누르며 낮은 목소리로 말했다.\n“우리는 짐승만 잡습니다. 사람은 죽이지 않습니다.”\n\n모건은 비웃음을 흘렸다.\n“저놈들은 결국 하게 돼. 시간문제일 뿐이지. 저런 애들은 많이 봤어. 타고난 테러리스트야.”"},
    {image:1, text:"서복은 참지 못하고 반박했다.\n“당신 눈에는 누구나 테러리스트로 보이겠죠. 당신들이 없었다면 테러리스트가 어디서 생겼겠습니까.”\n\n모건의 눈빛이 날카로워졌다.\n“뭐라고 했지?”"},
    {image:1, text:"서복의 표정이 완전히 진지해졌다.\n\n“당신 상관이 이미 석방 명령서에 서명했습니다. 우리는 자유입니다. 다시 소개하죠. 우리는 요리사입니다. 테러리스트가 아니라. 아시겠습니까?”"},
    {image:1, text:"그 말에 모건은 잠시 멈칫했다. 한동안 침묵하던 그는 잔을 들어 술을 한 모금 마셨다. 자리에서 일어나 떠나며 담담하게 말했다.\n\n“행운을 빌지, 셰프.”\n\n서복은 그의 뒷모습을 바라보았다.\n“고맙습니다.”\n\n“영어 잘하는군.”"},
    {image:2, text:"서복이 주방으로 돌아오자 마준생이 사이프와 웃으며 이야기하고 있었다. 마준생은 평생 본 사람 중 사이프가 가장 배짱이 크다며 농담했다. 돌아가면 용식당을 이 아이에게 맡겨 사장으로 삼겠다는 약속까지 했다.\n\n서복은 웃으며 마 사장에게 허풍만 떨지 말고, 함께 벽돌담 옆에서 담배나 한 대 피우며 다리를 쉬자고 했다."},
    {image:3, text:"서복은 발코니에서 담배를 피우다 맞은편에서 놀이를 하는 미군들을 보고 저도 모르게 웃었다.\n\n모두가 수용소의 웃음소리 속에서 긴장을 풀고 있었다. 서복은 담배 연기를 내뿜었다. 흥겨운 축제의 그림자 속에서 불운이 조용히 문을 두드리고 있다는 사실은 꿈에도 모른 채."}
  ];
  window.showPrisonChristmasUndercurrent = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "prison-christmas-undercurrent-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "크리스마스의 그림자");
    const art = document.createElement("div"); art.className = "prison-christmas-undercurrent-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-christmas-undercurrent-${n}.jpg`;
      img.alt = ["몰래 전해진 비밀 쪽지", "서복 곁에 앉은 모건 장교", "주방에서 이야기를 나누는 서복과 마준생, 사이프", "발코니에서 담배를 피우는 서복"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live", "polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}], {duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,140);
      const page = pages[index], incoming = images[page.image];
      if (current !== page.image) {
        await incoming.decode(); scene.dataset.image = String(page.image);
        incoming.style.zIndex = "1"; await fade(incoming,0,1,850);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";});
        current = page.image;
      }
      scene.dataset.step = String(index); prose.textContent = page.text;
      await fade(prose,0,1,300); busy = false;
    }
    function advance() {if (busy) return; if (index === pages.length - 1) {busy = true; window.showPrisonBlueOnBlue(scene); return;} index++; show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    await images[0].decode(); document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
