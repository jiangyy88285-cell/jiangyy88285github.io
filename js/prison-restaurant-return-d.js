(() => {
  "use strict";
  const pages = [
  {
    "image": -1,
    "text": "오랜 세월이 흐른 뒤"
  },
  {
    "image": 0,
    "text": "뜨거운 중동의 햇살이 구시가지로 향하는 관광버스 위로 쏟아졌다.\n\n가이드는 마이크를 들고 관광객들에게 설명했다.\n“오늘은 관광 셋째 날이고, 일정은 조금 여유롭습니다. 곧 구시가지 중심부에 도착합니다. 그곳에서는 절대로 마음대로 돌아다니지 마세요. 정부 기관들이 있고, 경찰들은 모두 총을 가지고 있습니다.”"
  },
  {
    "image": 0,
    "text": "“그다음에는 국립박물관으로 갑니다. 두 시간 정도면 다 둘러볼 수 있고, 저녁에는 중국 상공회로 돌아가 식사합니다…… 다시 한번 말씀드리지만 안전이 최우선입니다. 안내에 따라 주시고, 무슨 일이 있으면 저에게 말씀하세요. 제가 도와드리겠습니다……”\n\n귀밑머리가 희끗해진 서복은 창가에 조용히 앉아, 유리 너머 익숙하면서도 낯선 땅을 바라보았다. 갑자기 그의 시선이 길모퉁이의 한 건물에 꽂혔다.\n\n“기사님, 잠깐만 세워 주세요!”"
  },
  {
    "image": 1,
    "text": "버스가 길가에 멈췄다.\n\n서복은 비틀거리며 내려, 기억을 더듬어 익숙한 문 앞으로 다가갔다.\n\n그 위에는 분명히 적혀 있었다.\n\n‘룽 식당’."
  },
  {
    "image": 2,
    "text": "“어서 오세요. 중국 분이세요?”\n식당 종업원이 중국어로 반갑게 인사했다.\n\n“이 식당은 계속 있었나요?” 서복이 물었다.\n“몇 번 이사했어요. 앉으세요.”\n\n서복은 자리에 앉았다.\n“무엇을 드시겠어요?”"
  },
  {
    "image": 3,
    "text": "서복은 떨리는 손으로 메뉴를 받아 천천히 넘겼다. 익숙한 음식 하나에 시선이 닿자, 온몸이 굳어 버렸다.\n\n“이건 뭔가요?”\n“고기와 채소, 밥이에요.” 종업원이 답했다.\n\n“아니, 왜 이런 이름이 붙었냐는 뜻이에요.”\n“아, 그건……”\n\n“아랍어로 말해도 돼요. 알아들을 수 있어요.”"
  },
  {
    "image": 2,
    "text": "“네, 알겠습니다. 이런 이야기예요. 이십여 년 전에 한 중국인 요리사가 극단주의자들에게서 스무 명이 넘는 아이들을 구했어요.\n\n그들은 국경 밖까지 도망쳤지만 결국 붙잡혔죠. 이건 그 요리사가 살해되기 전에 아이들에게 마지막으로 만들어 준 음식이에요.\n\n나중에 아이들이 그분을 기리려고 이런 이름을 붙였답니다.”"
  },
  {
    "image": 2,
    "text": "“그 아이들이 죽지 않았다는 말인가요?”\n서복은 뜻밖이라는 듯 물었다.\n\n“그럼요. 죽었다면 이 음식이 어떻게 전해졌겠어요? 중국인 요리사가 아이들을 국경 밖으로 데리고 나온 덕분이죠. 그래서 국경수비대가 극단주의자들을 막을 수 있었어요.”"
  },
  {
    "image": 2,
    "text": "“전투는 아주 치열했지만, 결국 극단주의자들은 전멸했고 아이들도 구출됐어요.\n\n그때 구조된 아이들 중에 저희 식당 사장님이자 주방장님도 있었다는 소문이 있어요. 누가 알겠어요? 너무 오래전 일이잖아요.”"
  },
  {
    "image": 3,
    "text": "“손님, 한 접시 드릴까요?”\n\n“한 접시 주세요.”\n서복의 마음에 잔잔한 울림이 일었다."
  },
  {
    "image": 2,
    "text": "“네, 더 필요하신 건 없으세요?”\n\n“없어요. 고맙습니다.”\n\n“천만에요.”"
  }
];
  window.showPrisonRestaurantReturnD = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save" || decisions.mouthChoice !== "open")) return false;
    const scene = document.createElement("section"); scene.className = "prison-restaurant-return-d-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","오랜 세월 뒤 룽 식당에서 전해 들은 아이들의 소식");
    const art = document.createElement("div"); art.className = "prison-restaurant-return-d-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-restaurant-return-d-${n}.${n === 1 ? "png" : "jpg"}`;
      img.alt = ["구시가지를 지나는 관광버스","룽 식당 간판을 바라보는 서복","식당 종업원과 이야기를 나누는 서복","익숙한 음식 이름을 발견한 메뉴판"][i];
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
      scene.dataset.image = String(page.image); scene.dataset.step = String(index);
      if (page.image >= 0 && current !== page.image) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1000);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,400);
      scene.dataset.phase = index === pages.length - 1 ? "awaiting-finale" : "story";
      if (index === pages.length - 1) window.pendingStoryEnding = {ending:"D",outcome:"children-rescued-news"};
      busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {
        if (typeof window.showPrisonReunionD !== "function") return;
        busy = true; const moved = await window.showPrisonReunionD(scene,{preview});
        if (!moved) busy = false; return;
      }
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
