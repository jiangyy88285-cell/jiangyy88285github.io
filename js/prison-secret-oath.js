(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "깊은 밤, 주방에 어린아이들이 둥글게 둘러앉았다.\n\n사이프는 유난히 진지한 얼굴로 모두를 바라보았다.\n“맹세를 어기는 사람은 지옥에 가. 지금부터 내가 하는 말은 절대로 아무에게도 말하지 않겠다고 맹세해야 해!”\n\n몇몇 아이가 서로 눈치를 보며 의아한 듯 목소리를 낮췄다.\n“사이프, 무슨 일이야?”\n\n“아주 심각한 일이야.” 사이프가 낮은 목소리로 말했다. “우리 모두의 목숨이 걸려 있어. 난 너희를 해치지 않아. 날 믿어.”"
  },
  {
    "image": 1,
    "text": "사이프의 단호한 눈빛을 바라보던 아이들도 점차 마음이 움직였다. 하나둘 손을 들고 말했다.\n\n“맹세할게……”\n“나도 맹세해……”"
  },
  {
    "image": 2,
    "text": "그날 밤, 사이프는 다른 사람들이 자리를 비운 틈을 타 몰래 주방으로 달려와 서복에게 알렸다.\n\n“가겠다는 애가 몇 명 안 돼요. 스물세 명 중에 절반도 안 돼요.”\n\n서복이 길게 한숨을 내쉬었다.\n“그렇게 적어?”\n“아이들은 알리 교장님을 더 믿어요.” 사이프가 힘없이 고개를 숙였다.\n\n서복은 이를 악물고 결심했다.\n“좋아. 가겠다는 아이들에게 전해. 금요일 새벽 세 시, 시간 맞춰 출발한다!”"
  }
];
  window.showPrisonSecretOath = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || !["hide","stay"].includes(decisions.saifTrunk) || decisions.potatoConfession !== "admit" || decisions.childrenRescue !== "save")) return false;
    const scene = document.createElement("section"); scene.className = "prison-secret-oath-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들의 비밀 맹세와 금요일 새벽의 탈출 약속");
    const art = document.createElement("div"); art.className = "prison-secret-oath-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-secret-oath-${n}.jpg`;
      img.alt = ["아이들에게 비밀을 지켜 달라고 말하는 사이프","손을 들고 맹세하는 아이들","주방에서 서복에게 아이들의 대답을 전하는 사이프"][i];
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
        if (typeof window.showPrisonFridayEscape !== "function") return;
        busy = true; const moved = await window.showPrisonFridayEscape(scene,{preview});
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
