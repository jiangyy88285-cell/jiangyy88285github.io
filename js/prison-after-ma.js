(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "교장은 총을 거두고 바닥에 주저앉은 서복 앞으로 천천히 걸어왔다.\n\n“다른 아이들이 회복하면 네 제자도 함께 출발시켜라. 이의 없겠지?”\n\n서복이 핏기 없는 얼굴로 아무 반응도 보이지 않자, 교장은 다시 다그쳤다.\n“이의 없겠지?”"
  },
  {
    "image": 1,
    "text": "“피는 깨끗이 닦아.”\n\n교장은 차갑게 한마디를 남기고 돌아섰다. 무장한 부하들이 곧바로 다가와 마준생의 시신을 끌고 갔다.\n\n냉혹한 무장 병사들이 모두 떠난 뒤, 넓은 주방에는 서복만 남았다. 그는 아직 피가 마르지 않은 바닥에 멍하니 엎드려 있었다. 자이드는 참혹한 광경을 복잡한 눈빛으로 바라보다 가볍게 한숨을 쉬고 조용히 떠났다."
  },
  {
    "image": 1,
    "text": "서복은 형제 같은 사람이 남긴 핏자국을 멍하니 바라보았다. 그리고 고개를 숙여 손에 쥔 싹 난 감자를 내려다보았다.\n\n함께 걸어온 길의 순간들과 웃음소리가 떠올랐다. 더는 버틸 수 없어진 서복은 완전히 무너졌다. 두 손으로 얼굴을 가린 채 오열했고, 눈물은 걷잡을 수 없이 흘러내렸다."
  },
  {
    "image": 2,
    "text": "다음 날"
  },
  {
    "image": 3,
    "text": "주방 구석에서 사이프는 낡은 천 조각으로 아직 마르지 않은 핏자국을 몇 번이고 힘껏 문지르고 있었다.\n\n서복이 천천히 다가와 몹시 쉰 목소리로 말했다.\n“그만 닦아. 지워지지 않아.”\n\n그는 천천히 쪼그려 앉아 사이프를 바라보았다.\n“아침에는 죽, 점심에는 볶음밥이랑 채소 수프, 저녁에는 난을 만들자. 아이들이 배탈이 났으니 얼른 기력을 되찾아야 해. 힘이 있어야 우리랑 같이 도망칠 수 있으니까.”"
  },
  {
    "image": 3,
    "text": "사이프가 멍하니 고개를 들어 서복을 바라보았다.\n\n서복은 손을 뻗어 아이의 어깨를 다독이며 낮은 목소리로 당부했다.\n“아이들에게 말해 줘야 해. 전쟁터에 가면 어떤 일이 벌어지는지…… 난 채소 가게에 다녀오마. 장을 봐야지.”"
  }
];
  window.showPrisonAfterMa = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit")) return false;
    const scene = document.createElement("section"); scene.className = "prison-after-ma-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","마준생을 잃은 밤과 아이들을 구하려는 결심");
    const art = document.createElement("div"); art.className = "prison-after-ma-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-after-ma-${n}.jpg`;
      img.alt = ["서복을 차갑게 내려다보는 교장","마준생이 쓰러진 주방에 남은 서복","다음 날 아침의 주방","바닥의 핏자국을 닦는 사이프와 서복"][i];
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
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {
        if (typeof window.showPrisonRescueChoice !== "function") return;
        busy = true; await fade(prose,1,0,600);
        const moved = await window.showPrisonRescueChoice(scene,{preview});
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
