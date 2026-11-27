(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "교장은 줄곧 이 무고한 아이들을 소모품이자 전쟁 도구로 취급했다. 더는 견딜 수 없어진 마준생이 울먹이며 서복에게 호소했다. 당장 더 큰 차로 바꿔 아이들을 모두 데리고 달아나자고 했다. 추가 비용은 자신이 갚겠다고 다급히 말했지만, 서복은 눈을 붉힌 채 고개를 저었다.\n\n“돈 문제가 아니야. 밀입국 알선책은 일주일 뒤에나 출발을 준비할 수 있대. 그런데 아이들은 모레 전쟁터로 가잖아. 우리가 앞당길 수 있어, 아니면 저쪽이 미룰 수 있어? 도저히 시간이 안 돼……”"
  },
  {
    "image": 0,
    "text": "곧 총알받이로 내몰릴 아이들을 바라보며 마준생은 치미는 서러움을 삼키고 애써 기운을 냈다.\n\n“아이들한테 감자 넣고 소고기 스튜를 해 줘요. 떠나기 전에…… 맛있는 거 한 끼는 먹게요. 제가 재료 손질할게요. 그래도 되죠, 형?”\n“그래.”"
  },
  {
    "image": 0,
    "text": "어슴푸레한 불빛 아래, 아이들은 식탁에 둘러앉아 김이 모락모락 나는 소고기를 조용히 먹었다. 얌전하고 가여운 아이들을 바라보는 마준생의 마음은 쓰라리기만 했다."
  },
  {
    "image": 1,
    "text": "그때 사이프가 물통을 들고 말없이 지나갔다.\n\n“좀 쉬어, 사이프 요리사.” 마준생이 그를 불러 세웠다. “괜찮아. 정리는 나중에 하고, 이리 와서 앉아.”"
  },
  {
    "image": 2,
    "text": "사이프가 얌전히 앉자 마준생은 숨겨 두었던 코카콜라 하나를 몰래 건넸다.\n\n“어디서 났어요?”\n“안 알려 주지.” 마준생이 눈을 찡긋했다. “이 지긋지긋한 곳을 나가면 우리 형제끼리 이걸 따서 제대로 축하하자. 네 스승님은 절대 끼워 주지 말고. 한 방울도 안 줘서 부러워 죽게 하자고.”\n\n두 사람은 곧 나직이 웃음을 터뜨렸다."
  },
  {
    "image": 1,
    "text": "사이프는 잠시 머뭇거리다 의아한 듯 물었다.\n“리나 선생님이 물건을 훔치면 손을 자른다고 했어요.”\n“넌 다 커서 아직도 그 말을 믿어?” 마준생이 놀렸다. “네 스승님이 네 머리를 자르겠다고 한 건 왜 안 믿는데?”\n\n사이프는 차가운 콜라를 꼭 쥐고 나직이 말했다.\n“고마워요.”\n마준생이 손을 내저었다.\n“고맙긴, 그냥 음료수 하나인데.”"
  },
  {
    "image": 1,
    "text": "“아니에요.” 사이프는 천천히 성한 눈을 들어 올렸다. 표정은 더없이 진지했다. “계속 모두를 구하려고 해 줘서 고마워요. 하지만 스승님은 그러고 싶지 않으시잖아요.”\n\n마준생이 곧바로 반박했다.\n“구하고 싶어 하셔! 분명히 그래. 기회가 없을 뿐이야. 알겠니?”\n\n사이프는 마준생을 깊이 바라보며 낮지만 단호한 목소리로 대답했다.\n“알아요.”"
  }
];
  window.showPrisonColaPromise = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk))) return false;
    const scene = document.createElement("section"); scene.className = "prison-cola-promise-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들의 저녁 식사와 콜라에 담긴 약속");
    const art = document.createElement("div"); art.className = "prison-cola-promise-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-cola-promise-${n}.jpg`;
      img.alt = ["소고기 요리를 조용히 먹는 아이들","나란히 앉아 이야기하는 마준생과 사이프","몰래 건네받은 코카콜라"][i];
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
        if (typeof window.showPrisonPotatoConfession !== "function") return;
        busy = true; const moved = await window.showPrisonPotatoConfession(scene,{preview});
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
