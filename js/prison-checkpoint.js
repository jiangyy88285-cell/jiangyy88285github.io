(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "차량 행렬이 지정된 장소에 도착하자 장교가 차갑게 명령했다.\n“내려.” 그는 자말에게 책가방 하나를 건넸다.\n\n“뒤에 줄 선 사람들 보이지? 저 사람들을 따라 줄을 서서 도시로 들어가. 안에 널 기다리는 사람이 있을 거다. 그 사람에게 이 가방을 건네면 첫 번째 임무는 끝이야. 난 여기서 네가 돌아오길 기다리겠다.”\n\n자말은 가방을 꼭 움켜쥐었다. 눈빛에 불안이 스쳤다.\n“어떻게 생긴 사람이에요?”\n“걱정 마. 그 사람은 널 알아봐.” 장교가 그를 응시했다. “겁나나?”\n“아닙니다.” 자말이 애써 대답했다.\n“그럼 가 봐.”\n“알겠습니다, 장교님.”"
  },
  {
    "image": 1,
    "text": "그 시각, 뒤쪽 짐칸의 좁은 틈에 숨어 있던 사이프는 숨을 죽인 채 밖에서 벌어지는 모든 일을 경계하며 지켜보고 있었다."
  },
  {
    "image": 2,
    "text": "자말은 사람들로 북적이는 길목에 홀로 서 있었다."
  },
  {
    "image": 3,
    "text": "앞에 보이는 삼엄한 미군 검문소를 바라보며 의심이 든 그는 천천히 배낭의 지퍼를 열었다——"
  },
  {
    "image": 4,
    "text": "다음 순간, 그는 그 자리에 얼어붙었다. 배낭 안에 든 것은 물자가 아니었다. 이미 시간이 설정되어 언제든 터질 수 있는 시한폭탄이었다!\n\n그는 선택받은 “성전의 전사”가 아니었다. 처음부터 군벌이 자살 공격에 이용하려던 인간 폭탄에 불과했다."
  },
  {
  "image": 4,
  "text": "“이봐, 앞으로 가!” 옆에서 줄을 서 있던 사람이 참지 못하고 재촉했다.\n\n그러나 자말은 온몸이 굳어 버린 채 그 자리에 멍하니 서 있었다.\n\n“안 들려? 네가 줄을 막고 있잖아.”"
}
];
  window.showPrisonTrunkNextChapter = async (previous = null, choice = "hide", {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (choice !== "hide" || (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || decisions.saifTrunk !== "hide"))) return false;
    const scene = document.createElement("section"); scene.className = "prison-checkpoint-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","자말의 임무와 배낭 속 진실");
    const art = document.createElement("div"); art.className = "prison-checkpoint-art";
    const images = [1,2,3,4,5].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-checkpoint-${n}.jpg`;
      img.alt = ["차 안에서 자말에게 임무를 지시하는 장교","짐칸 틈에서 밖을 지켜보는 사이프","사람들로 붐비는 길목에 홀로 선 자말","배낭의 지퍼를 여는 자말","배낭 안에 숨겨진 시한폭탄"][i];
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
        if (typeof window.showPrisonPhoneCommand !== "function") return;
        busy = true; const moved = await window.showPrisonPhoneCommand(scene,{preview});
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
