(() => {
  "use strict";
  const narration = [
    "“삐삐삐— 삐삐삐—”\n날카로운 알람 소리가 새벽의 적막을 깨뜨렸다. 서복은 거칠어진 손을 뻗어 익숙하게 알람을 껐다.",
    "방 안은 다시 조용해졌다. 창밖에서 희미하게 들려오는 경적과 소란만 남았다. 그는 몸을 일으켜 어스름한 새벽빛 아래 책상 위의 가위를 집어 들었다.",
    "서복은 조금 누렇게 바랜 가족사진의 가장자리를 조심스럽게 잘라 냈다. 사진 속 웃음은 따뜻했지만, 현실의 무게는 너무도 무거웠다.",
    "시간은 2002년으로 거슬러 올라간다. 갑작스러운 화재는 서복의 삶이 무너지는 시작이었다. 그가 운영하던 작은 식당에 불이 나 오랜 세월 모은 돈이 잿더미가 되었고, 손님들까지 화상을 입었다.",
    "수십만 위안에 달하는 치료비가 평범한 요리사의 어깨를 거대한 산처럼 짓눌렀다. 막다른 길에 몰린 서복은 해외 취업 알선 일을 하는 사촌 동생에게 희망을 걸었다. 중동으로 가서 식당을 여는 것이었다.",
    "그때 그는 생각했다. 멀면 좀 어떤가. 빨리 돈을 벌어 빚만 갚을 수 있다면 됐다.",
    "집을 떠나는 날, 서복은 현관에서 딸 서락을 재촉했다.\n“락락아, 몇 번을 불렀니. 안 나오면 아빠 그냥 간다.”\n어머니가 곁에서 불렀다. “자, 차에 타. 만두야.”",
    "딸이 좀처럼 나오지 않자 서복은 초조해졌다.\n“서락! 부르는 거 안 들려? 얘가 왜 이래?”\n어머니가 그의 팔을 붙잡았다. “일단 앉아 봐. 물어볼 게 있다.”",
    "“무슨 일인데?”\n“너 나가서 돈 벌면, 거기서 장가들고 애 낳고 안 돌아오는 거 아니냐?”\n서복은 기가 막히면서도 웃음이 났다. “엄마, 무슨 소리야.”",
    "어머니가 목소리를 낮췄다.\n“락락이 친구 아빠가 그렇게 안 돌아왔대. 밖에서 새 가정을 꾸렸대.”\n“어떤 놈이 그런 헛소리를 해? 엄마는 내가 그럴 사람 같아?”",
    "“아니. 넌 그럴 능력이 없지.”\n“누가? 내가 없다고?”\n“그래, 넌 없어. 그런데 락락이는 믿었어. 네가 달래 줘야지.”\n서복은 헛웃음을 지었다. “달래긴 뭘 달래. 가서 혼내야지.”",
    "그는 딸의 방으로 들어가 몸을 낮추고 다정하게 말했다.\n“딸아, 아빠는 그럴 마음이 있어도 배짱이 없어. 배짱이 있어도 능력이 없고. 됐지?”",
    "그는 막 배운 아랍어로 한마디를 해 보았다.\n“생일 축하해.”\n서락이 어리둥절한 얼굴로 고개를 들었다. “뭐라고?”\n“생일 축하한다고. 아랍어야.”",
    "“그래서 뭐. 아직 세 달이나 남았는데.”\n서복은 손을 비비며 진지하게 말했다.\n“그땐 아빠가 없잖아. 전엔 아빠가 사 준 것도 안 좋아했지. 반성했어. 우리 딸이 제일 좋아하는 건 현금이더라.”",
    "서락은 고개를 돌렸다. “저리 가.”\n“내년엔 이것보다 더 줄게. 할머니한테 꼭 달라고 해.”\n서락의 눈에 의문이 스쳤다. “아니, 매년 돌아온다고 했잖아?”",
    "서복은 잠시 말이 없다가 사실대로 털어놓았다.\n“왕복으로 서른 시간 넘게 비행기를 타야 해. 비행기표도 엄청 비싸고. 그냥 두 해를 쭉 있으려고. 빚도 갚고 좀 더 벌 수 있잖아. 그 돈을 왜 낭비해.”",
    "서락의 목소리가 울먹였다.\n“지키지도 못할 거면서 왜 약속했어?”\n“아빠 한 번 덜 보는 거잖아. 그 일 년이 그렇게 중요해?”\n“또 왜 그래?”",
    "서락은 이불을 뒤집어썼다.\n“아무것도 아냐. 출발해. 비행기 놓치지 말고. 표 엄청 비싸다며.”\n서복은 목소리를 누그러뜨렸다. “아빠가 나가서 돈 버는 것도 다 너 때문이잖아.”\n서락이 작게 대답했다. “알아.”",
    "정말 떠날 시간이 되었다. 이별의 감정이 끝내 차올라 소녀의 얼굴에 눈물이 흘러내렸다.\n당황한 서복이 말했다. “아이고, 왜 이래.”\n더 머물 자신이 없던 그는 이를 악물었다. “어서 가자.”",
    "그는 돌아서서 나가다 어머니에게 당부했다.\n“나 갈게. 엄마, 밥 잘 챙겨 먹어.”\n어머니가 대답했다. “너도.”",
    "공항의 인파 속에서 마준생이 서복을 맞이했다. 한 사람은 요리를 하고, 다른 한 사람은 곁에서 도울 터였다. 생계를 짊어진 두 이방인은 함께 바하타로 향했다."
  ];
  const context = "시간은 2002년으로 거슬러 올라간다. 갑작스러운 화재는 서복의 삶이 완전히 무너지는 시작이었다. 그가 운영하던 작은 식당에 불이 나 오랜 세월 모은 돈이 잿더미가 되었고, 손님들까지 화상을 입었다. 수십만 위안에 달하는 치료비가 거대한 산처럼 평범한 요리사의 어깨를 짓눌렀다. 막다른 길에 몰린 서복은 해외 취업 알선 일을 하는 사촌 동생에게 희망을 걸었다. 중동으로 가서 식당을 여는 것이었다. 멀면 좀 어떤가. 빨리 돈을 벌어 빚만 갚을 수 있다면 됐다.";
  // Display original files through proportional photo windows; never stretch the artwork.
  const pictures = [
    {file:"memory-img_3553.jpg",ratio:"11 / 10",size:.58,offset:-9,angle:.5,position:"58% 50%",alt:"새벽, 침대에서 몸을 일으키는 서복"},
    {file:"memory-family-photo.png",ratio:"7 / 10",size:.72,offset:4,angle:-.5,position:"55% 50%",alt:"가족사진을 조심스럽게 자르는 손"},
    {file:"memory-img_3552.jpg",ratio:"13 / 20",size:1.05,offset:0,angle:.3,position:"70% 50%",alt:"창 너머 주방의 서복"},
    {file:"memory-img_3550.jpg",ratio:"19 / 10",size:1.18,offset:8,angle:-.4,position:"57% 50%",alt:"식당의 화재"},
    {file:"memory-img_3551.jpg",ratio:"13 / 10",size:1.2,offset:-1,angle:.3,position:"50% 50%",alt:"식탁에서 이야기를 나누는 가족"},
    {file:"memory-img_3554.jpg",ratio:"41 / 50",size:1.08,offset:4,angle:-.4,position:"65% 50%",alt:"비행기 안에서 창밖을 바라보는 서복"},
    {file:"memory-img_3556.jpg",ratio:"2732 / 1346",size:1.827,offset:-10,angle:.6,position:"50% 50%",alt:"구름 아래로 펼쳐진 도시와 강"},
    {file:"memory-img_3558.jpg",ratio:"7 / 5",size:1.45,offset:6,angle:-.3,position:"45% 50%",alt:"함께 모인 사람들"}
  ];
  window.showMemoryGallery = done => new Promise(resolve => {
    const page = document.createElement("section"); page.className = "memory-gallery"; page.lang = "ko";
    page.setAttribute("aria-label", "2002년, 떠나던 날의 기억");
    page.innerHTML = '<div class="memory-narration"><p></p><p aria-hidden="true"></p></div><div class="memory-rail" tabindex="0" role="region" aria-label="사진을 왼쪽으로 끌거나 방향키로 이동"><div class="memory-track"></div></div><p class="memory-context"></p><div class="memory-footer"><small>← 사진을 왼쪽으로 밀어 기억을 읽어 보세요</small></div>';
    const rail = page.querySelector(".memory-rail"), track = page.querySelector(".memory-track");
    const [current, upcoming] = page.querySelectorAll(".memory-narration p");
    let canContinue = false;
    page.querySelector(".memory-context").textContent = context;
    pictures.forEach(picture => {
      const figure = document.createElement("figure"); figure.className = "memory-fragment";
      figure.style.setProperty("--fragment-width",picture.size);
      figure.style.setProperty("--fragment-ratio",picture.ratio);
      figure.style.setProperty("--fragment-y",`${picture.offset}cqh`);
      figure.style.setProperty("--fragment-angle",`${picture.angle}deg`);
      const image = document.createElement("img");
      image.src = `../js/images/${picture.file}`;
      image.alt = picture.alt; image.draggable = false;
      image.style.objectPosition = picture.position;
      figure.append(image); track.append(figure);
    });
    let frame = 0;
    function render() {
      frame = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const progress = max > 0 ? Math.min(1, Math.max(0, rail.scrollLeft / max)) : 0;
      const position = progress * (narration.length - 1);
      const index = Math.floor(position);
      const blend = Math.min(1, Math.max(0, ((position - index) - .65) / .35));
      current.textContent = narration[index]; current.style.opacity = 1 - blend;
      upcoming.textContent = narration[Math.min(index + 1,narration.length - 1)]; upcoming.style.opacity = blend;
      canContinue = max > 0 && max - rail.scrollLeft <= 2;
    }
    rail.addEventListener("scroll", () => { if(!frame) frame = requestAnimationFrame(render); }, {passive:true});
    rail.addEventListener("wheel", event => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); rail.scrollLeft += event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? rail.clientWidth : 1); }
    }, {passive:false});
    let drag = null, suppressClickUntil = 0;
    rail.addEventListener("pointerdown", event => {
      if(event.pointerType !== "mouse" || event.button !== 0) return;
      drag = {x:event.clientX,scroll:rail.scrollLeft}; rail.setPointerCapture(event.pointerId); rail.classList.add("is-dragging");
    });
    rail.addEventListener("pointermove", event => {
      if (!drag) return;
      if (Math.abs(event.clientX - drag.x) > 4) suppressClickUntil = performance.now() + 300;
      rail.scrollLeft = drag.scroll - (event.clientX - drag.x);
    });
    const release = () => { drag = null; rail.classList.remove("is-dragging"); };
    rail.addEventListener("pointerup",release); rail.addEventListener("pointercancel",release); rail.addEventListener("lostpointercapture",release);
    rail.addEventListener("keydown",event => {
      if (event.key === "Enter" && canContinue) { event.preventDefault(); enterNextScene(); return; }
      if(!["ArrowRight","ArrowLeft","Home","End"].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === "Home" ? 0 : event.key === "End" ? rail.scrollWidth : rail.scrollLeft + (event.key === "ArrowRight" ? 1 : -1) * rail.clientWidth / 4;
      rail.scrollTo({left:target,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
    });
    const observer = new ResizeObserver(render); observer.observe(rail);
    let transferring = false;
    async function enterNextScene() {
      if(!canContinue || transferring) return;
      transferring = true;
      observer.disconnect(); cancelAnimationFrame(frame);
      const entrance = window.showRestaurantEntrance();
      page.remove();
      await entrance;
      resolve(); if(done) done();
    }
    page.addEventListener("click", event => {
      if (event.target.closest("button") || performance.now() < suppressClickUntil) return;
      enterNextScene();
    });
    document.body.append(page); render(); rail.focus({preventScroll:true});
  });
})();
