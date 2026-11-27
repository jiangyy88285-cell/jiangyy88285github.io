(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "“잠깐만요!”\n총구가 겨눠진 서복은 겁에 질려 거칠게 숨을 몰아쉬며 온몸을 떨었다.\n\n“잠깐만요, 교장님!” 마준생이 미친 듯이 달려들어 두 사람 사이를 가로막았다. “오마르, 무함마드, 우리 좋은 친구잖아요? 교장님께 설명 좀 하게 해 주세요. 제발요! 감사합니다!”"
  },
  {
    "image": 1,
    "text": "그는 다급히 교장 쪽으로 고개를 돌렸다.\n\n“교장님, 저희도 좋은 뜻이었습니다. 아이들이 곧 떠나니까 특별히 감자 넣은 소고기 스튜를 만들었어요. 그런데 요즘 감자가 상태가 안 좋아서요.”\n\n마준생은 등 뒤에서 싹 난 감자 하나를 꺼내 교장에게 보여 주었다.\n\n“전부 싹이 나 있더라고요. 제가 재료를 손질할 때 감자 싹을 깨끗이 제거하지 못했나 봅니다.”"
  },
  {
    "image": 0,
    "text": "교장이 말을 끊었다. 차가운 시선이 마준생의 얼굴을 꿰뚫듯 응시했다.\n“잠깐. 네가 깨끗이 제거하지 않았다는 말인가?”\n\n“네, 교장님.” 마준생은 목소리를 떨면서도 단호한 눈빛을 보였다. “다시는 이런 일이 없도록 하겠습니다. 맹세합니다.”\n\n“그러니까 이번 일은 네 책임이다? 내 맹세를 어기게 만든 건 너고, 저 사람과는 상관없다는 거지?” 교장이 차갑게 되물었다.\n\n죽음 같은 침묵이 흘렀다.\n“그렇지?” 교장이 목소리를 높여 추궁했다."
  },
  {
    "image": 2,
    "text": "마준생은 서복을 돌아보고 후련한 듯 희미하게 웃었다. 가까이 다가가 작은 목소리로 투덜거렸다.\n“안 속네요.”\n\n그는 감자에서 싹 난 부분을 살짝 떼어 냈다.\n“감자 싹은 제가 일부러 넣었어요. 형한테 시간을 좀 벌어 주려고요. 폐를 끼쳤네요, 형.”\n\n그러고는 싹 난 감자를 서복의 손에 쥐여 주었다."
  },
  {
    "image": 2,
    "text": "마준생은 구석에 있던 사이프에게 다가가 나직이 당부했다.\n\n“밥 잘 챙겨 먹어, 사이프. 꼭 잘 챙겨 먹어야 해.”\n\n하고 싶었던 말을 모두 전한 뒤, 그는 교장을 향해 돌아섰다. 목소리는 더없이 단호했다.\n\n“맞습니다. 제가 했습니다.”"
  },
  {
    "image": 3,
    "text": "“탕!”"
  }
];
  window.showPrisonConfessionNextChapter = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit")) return false;
    const scene = document.createElement("section"); scene.className = "prison-ma-sacrifice-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","마준생의 고백과 마지막 당부");
    const art = document.createElement("div"); art.className = "prison-ma-sacrifice-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-ma-sacrifice-${n}.jpg`;
      img.alt = ["총구 앞을 가로막고 설명하는 마준생","교장에게 보여 주는 싹 난 감자","서복의 손에 감자를 쥐여 주는 마준생","권총을 겨눈 교장"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true, phase = "story";
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
      if (index === pages.length - 1) {
        scene.dataset.phase = "shot";
        if (!reduced) await new Promise(resolve => setTimeout(resolve,850));
        await Promise.all([fade(art,1,0,1700),fade(prose,1,0,500)]);
        prose.textContent = ""; scene.dataset.image = "-1";
        phase = "blue-pause"; scene.dataset.phase = phase; busy = false; return;
      }
      scene.dataset.phase = phase; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (phase === "blue-pause") {
        busy = true;
        prose.textContent = "둔탁한 총성이 깊은 밤을 찢었다. 반응할 틈조차 없이 마준생은 피 웅덩이 속으로 무겁게 쓰러졌다.\n\n서복과 사이프는 그 자리에 얼어붙었다.";
        await fade(prose,0,1,1000); phase = "complete"; scene.dataset.phase = phase; busy = false; return;
      }
      if (phase === "complete") {
        if (typeof window.showPrisonAfterMa !== "function") return;
        busy = true; const moved = await window.showPrisonAfterMa(scene,{preview});
        if (!moved) busy = false; return;
      }
      index++; await show();
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
