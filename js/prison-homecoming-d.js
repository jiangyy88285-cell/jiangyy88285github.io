(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "세 달 후, 서복은 마스크를 쓴 채 천천히 공항을 나섰다."
  },
  {
    "image": 1,
    "text": "서러는 연로한 할머니가 탄 휠체어를 밀며 공항 로비에서 초조하게 기다리고 있었다.\n\n서복이 마스크를 벗는 순간, 오랫동안 쌓인 그리움과 슬픔, 기쁨이 한꺼번에 눈물이 되어 쏟아졌다.\n\n가족은 서로를 꼭 끌어안고 흐느껴 울었다."
  },
  {
    "image": 2,
    "text": "“자이드는 정말 나를 놓아줬어. 그리고 한 가지를 가르쳐 줬지.\n\n숟가락을 든 사람도 남의 입을 벌리게 할 수 있고, 총을 든 사람도 그럴 수 있다는 걸.”"
  },
  {
    "image": 2,
    "text": "그때 자이드가 입을 벌리게 한 덕분에, 서복에게는 양쪽 뺨을 관통한 상처가 남았다.\n\n입을 벌리지 않았다면, 부서진 이빨이 머릿속으로 튀었을 것이다……"
  },
  {
    "image": 3,
    "text": "“가끔 같은 꿈을 꿔. 꿈속에서는 사이프도 준생이도 살아남아서, 다시 룽 식당으로 돌아와.\n\n이제 이십 년이 지났는데도 가끔 그 꿈을 꿔…… 하지만 꿈은 다 거짓이잖아.”\n\n“전쟁에서 요행이 어디 있겠어? 내가 살아남는 데 모든 운을 다 써 버린 거지, 그렇지?”"
  }
];
  window.showPrisonHomecomingD = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save" || decisions.mouthChoice !== "open")) return false;
    const scene = document.createElement("section"); scene.className = "prison-homecoming-d-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","세 달 뒤의 귀국과 이십 년 동안 남은 꿈");
    const art = document.createElement("div"); art.className = "prison-homecoming-d-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-homecoming-d-${n}.jpg`;
      img.alt = ["마스크를 쓰고 공항을 나서는 서복","공항에서 딸과 휠체어에 탄 어머니를 만나는 서복","식탁에 놓인 국수와 음식","창문 너머 식탁에 앉아 지난 일을 회상하는 서복"][i];
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
      if (current !== page.image) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1000);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,400);
      scene.dataset.phase = index === pages.length - 1 ? "awaiting-finale" : "story";

      busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {
        if (typeof window.showPrisonRestaurantReturnD !== "function") return;
        busy = true; const moved = await window.showPrisonRestaurantReturnD(scene,{preview});
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
