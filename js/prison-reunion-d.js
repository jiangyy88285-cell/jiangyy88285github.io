(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "서복은 손에 든 메뉴를 천천히 덮었다.\n\n그 화보 페이지에 아랍어와 중국어로 적힌 음식 이름은 분명했다.\n\n‘서복 후이판’."
  },
  {
    "image": 1,
    "text": "그의 눈앞이 순식간에 눈물로 흐려졌다. 그것은 단순한 음식 이름이 아니었다. 전쟁에서 살아남은 아이들이 오랜 세월을 바쳐 전하는 말 없는 고백이자, 가장 깊은 존경이었다.\n\n총성과 모래바람 속에 묻힌 줄 알았던 희망이, 지금 따뜻하고도 꿋꿋한 빛을 되찾고 있었다.\n\n가슴이 거세게 뛰었다. 밀려오는 감정을 더는 억누르지 못한 서복은 저도 모르게 발걸음을 옮겨 곧장 주방으로 향했다."
  },
  {
    "image": 2,
    "text": "좁고 긴 복도를 지나자 피어오르는 기름 연기와 익숙한 음식 냄새가 밀려왔다.\n\n김이 자욱한 조리대 앞에 요리사 옷을 입은 남자가 서 있었다. 그는 능숙하게 팬을 흔들며 요리를 하고 있었다."
  },
  {
    "image": 3,
    "text": "뒷모습뿐이었지만, 서복은 그의 머리에 두른 눈에 띄는 검은 안대를 곧바로 알아보았다.\n\n세월이 얼굴과 체격을 바꾸었어도, 꼬박 이십 년의 시간과 생사의 격변이 가로놓여 있었어도, 서복은 한순간에 그를 알아보았다.\n\n사이프였다."
  },
  {
    "image": 3,
    "text": "버려진 모스크 곁에서 “다시 돌아오실 거예요?”라고 묻던 아이. 죽음 앞에서 목숨을 걸고 그를 지키려던 아이.\n\n그 아이는 정말 살아남았다. 그리고 서복이 가르쳐 준 솜씨로, 이곳에서 그들만의 기억을 지켜 오고 있었다."
  },
  {
    "image": 2,
    "text": "서복은 주방 문가에 선 채 눈물을 머금었다.\n\n그의 얼굴에 안도와 평온이 깃든, 더없이 환한 미소가 천천히 번졌다."
  }
];
  const closing = "전쟁의 불길은 대지를 할퀼 수 있어도 인간의 선의를 지우지는 못한다. 총포는 세월을 찢을 수 있어도 기억 속 온기까지 끊어 내지는 못한다.\n\n그날 삶의 온기가 담긴 한 끼, ‘서복 후이판’은 황량한 국경에 희망의 씨앗을 심었다. 그 씨앗은 이십 년의 생사와 재난을 넘어, 평화와 재회의 햇살 아래 가장 아름다운 열매를 맺었다.\n\n총을 든 사람은 남의 고개를 숙이고 입을 벌리게 할 수 있다. 그러나 이 땅에 진정으로 뿌리내려 생명을 다시 살아나게 하는 것은, 숟가락을 든 사람의 보살핌과 사랑뿐이다.";
  window.showPrisonReunionD = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save" || decisions.mouthChoice !== "open")) return false;
    const scene = document.createElement("section"); scene.className = "prison-reunion-d-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","서복 후이판과 사이프와의 재회, 결말 D");
    const art = document.createElement("div"); art.className = "prison-reunion-d-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-reunion-d-${n}.jpg`;
      img.alt = ["서복 후이판이라는 이름이 적힌 메뉴","주방으로 이어지는 룽 식당의 문","주방 입구에서 요리사를 바라보는 서복","눈에 검은 안대를 두른 채 요리하는 사이프의 뒷모습"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true, endingLayer = null;
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
      scene.dataset.phase = index === pages.length - 1 ? "reunion" : "story";

      busy = false;
    }
    async function advance() {
      if (busy) return;
      if (scene.dataset.phase === "closing") {
        scene.dataset.phase = "awaiting-finale"; scene.dataset.storyEnded = "true";
        window.pendingStoryEnding = {ending:"D",outcome:"best-reunion",storyEnded:true};
        if (typeof window.showStoryFinale === "function") {
          busy = true; const moved = await window.showStoryFinale(scene,{ending:"D",outcome:"best-reunion"});
          if (!moved) busy = false;
        }
        return;
      }
      if (scene.dataset.phase === "awaiting-finale") return;
      if (index === pages.length - 1) {
        busy = true; scene.dataset.phase = "fading-white";
        endingLayer = document.createElement("div"); endingLayer.className = "prison-reunion-d-ending";
        endingLayer.lang = "ko"; endingLayer.setAttribute("aria-live","polite");
        const endingText = document.createElement("p"); endingText.textContent = closing; endingText.style.opacity = "0";
        endingLayer.append(endingText); endingLayer.addEventListener("click",advance); document.body.append(endingLayer);
        await fade(endingLayer,0,1,3000); await fade(endingText,0,1,1200);
        scene.dataset.ending = "D"; scene.dataset.phase = "closing";
        window.pendingStoryEnding = {ending:"D",outcome:"best-reunion"}; busy = false; return;
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
