(() => {
  "use strict";
  const captions = [
    "자드의 딸이 결혼식을 올리던 날, 주방에는 오랜만에 다시 요리 연기가 피어올랐다.",
    "철제 웍을 흔들 때마다 맑은 소리가 울렸고, 뜨거운 기름 소리와 음식 향이 공기 속에 뒤섞였다.",
    "김이 모락모락 나는 정통 중국 요리는 전쟁의 포연에 익숙해진 이국의 손님들을 감탄하게 했다.",
    "고아원 아이들은 깨끗한 옷을 입고 쟁반을 든 채 손님들 사이를 오갔다. 제법 능숙한 모습이었다.",
    "", "",
    "손님들이 떠들썩하게 음식을 즐기며 기뻐하는 모습을 보며 서복은 흐뭇해했다. 행주를 어깨에 걸치고 미소 지으며 고개를 끄덕였다.\n\n문득 고개를 돌리자 고아원 아이 사이프가 눈에 들어왔다. 아이는 그를 흉내 내어 수건을 목에 두르고 제법 그럴듯하게 고개를 들고 있었다.\n\n서복은 웃음이 터져 장난스럽게 물었다.\n“네가 다 한 거야? 아주 수고가 많으셨네?”\n\n사이프는 알 듯 말 듯 눈을 깜빡이더니 잽싸게 뛰어갔다.",
    ""
  ];
  const crops = [[122,0,560,278],[0,240,363,255],[252,390,382,293],[354,579,560,282],[8,787,560,280],[377,1031,424,278],[0,0,560,285],[377,1530,558,286]];
  window.showWedding = (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "wedding-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "자드의 딸의 결혼식");
    scene.innerHTML = '<div class="wedding-scroll" tabindex="0" aria-label="아래로 스크롤하여 결혼식 장면 보기"><div class="wedding-track"></div></div><aside class="wedding-dialogue" aria-live="polite" hidden></aside>';
    const scroller = scene.querySelector(".wedding-scroll"), track = scene.querySelector(".wedding-track"), dialogue = scene.querySelector("aside");
    crops.forEach(([x,y,w,h],i) => {
      const row = document.createElement("article"); row.className = "wedding-row";
      const photo = document.createElement("button"); photo.type = "button"; photo.className = "wedding-photo";
      photo.setAttribute("aria-label", i === 6 ? "서복과 사이프의 대화" : `결혼식 장면 ${i+1}`);
      photo.style.aspectRatio = `${w}/${h}`;
      const img = document.createElement("img"); img.alt = ""; img.draggable = false;
      img.src = i === 6 ? "../js/images/wedding-dialogue-reference.png" : "../js/images/wedding-reference.png";
      img.style.cssText = `width:${(i===6?560:1578)/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%;`;
      photo.append(img); row.append(photo);
      if (i !== 6 && captions[i]) {const p=document.createElement("p");p.textContent=captions[i];row.append(p);}
      photo.addEventListener("click", () => {if (active === 7) return; row.scrollIntoView({block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});});
      track.append(row);
    });
    const rows = [...track.children]; let active = -1, queued = false;
    function update() {
      queued = false;
      const box = scroller.getBoundingClientRect(), center = box.top + box.height/2;
      let nearest = 0, distance = Infinity;
      rows.forEach((row,i) => {const r=row.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-center);if(d<distance){nearest=i;distance=d;}});
      if (active === nearest) return; active = nearest;
      rows.forEach((row,i) => row.classList.toggle("is-active", i===active));
      dialogue.hidden = active !== 6;
      if (active === 6) dialogue.textContent = captions[6];
    }
    scroller.addEventListener("scroll", () => {if(!queued){queued=true;requestAnimationFrame(update);}}, {passive:true});
    document.body.append(scene); if(previous)previous.remove(); scroller.focus({preventScroll:true});
    requestAnimationFrame(update);
    const resize = new ResizeObserver(update);resize.observe(scroller);
    let leaving = false;
    function next() {
      if (active !== 7 || leaving) return;
      leaving = true; resize.disconnect(); window.showWeddingFamily(scene);
    }
    scene.addEventListener("click", next);
    scene.addEventListener("keydown", event => {
      if (active === 7 && (event.key === "Enter" || event.code === "Space")) {event.preventDefault(); next();}
    });
  };
  window.showWeddingFamily = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className = "wedding-family-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "가족사진을 바라보는 서복");
    const image = document.createElement("img");
    image.src = "../js/images/wedding-family-photo.png";
    image.alt = "지갑 속에 소중히 간직한 가족사진"; image.draggable = false;
    const prose = document.createElement("p");
    prose.textContent = "손님들이 가족과 둘러앉아 떠들썩하게 식사하는 모습을 보며, 서복의 가슴에는 문득 먹먹함이 밀려왔다. 그는 한쪽으로 가서 조리대에 기대앉았다. 품에서 오래전 반듯하게 잘라 두었던 가족사진을 꺼내, 사진 속 가족의 얼굴을 손끝으로 어루만졌다. 그러고는 도시락을 들어 사진을 바라보며 말없이 밥을 먹기 시작했다.";
    scene.append(image, prose);
    await image.decode();
    document.body.append(scene); scene.focus({preventScroll:true});
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700;
    await scene.animate([{opacity:0},{opacity:1}],{duration,easing:"ease-in-out"}).finished;
    if (previous) previous.remove();
    let leaving = false;
    function next() {if(leaving)return;leaving=true;window.showApprentice(scene);}
    scene.addEventListener("click", next);
    scene.addEventListener("keydown", event => {
      if(event.key === "Enter" || event.code === "Space") {event.preventDefault();next();}
    });
  };
})();
