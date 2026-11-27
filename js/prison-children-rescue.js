(() => {
  "use strict";
  const sharedPages = [
  {
    "image": 0,
    "text": "덜컹거리는 차를 타고 돌아오는 길."
  },
  {
    "image": 1,
    "text": "짐칸 안에 숨은 사이프는 몸을 잔뜩 웅크린 채, 이미 목이 메도록 울고 있었다."
  },
  {
    "image": 2,
    "text": "“자말은 전쟁터에서 매우 용감했다. 첫날부터 많은 선배를 뛰어넘는 전과를 올렸지. 자말을 위해 환호하자!” 교장이 차분히 선언했다.\n\n“오늘도 새로운 전사를 뽑을 시간이다. 누가 나서겠느냐?”\n\n이번에는 광적인 분위기에 세뇌된 아이들이 앞다투어 손을 들었다."
  },
  {
    "image": 3,
    "text": "마준생은 눈앞의 광경을 바라보며 붉어진 눈으로 나직이 말했다.\n“아이들도 같이 데려가요.”\n“차에 다 못 타.” 서복이 고개를 돌렸다. 목소리가 잠겨 있었다. “게다가 너무 위험해.”\n\n“안 데려가면 다 죽어요!” 마준생의 목소리에 절망과 애원이 뒤섞였다.\n“네 아이들도 아니잖아.” 서복이 애써 마음을 굳히고 목소리를 낮췄다.\n“그래도 아이들이잖아요!” 마준생은 끝내 눈물을 흘리며 단호하게 말했다.\n\n서복은 깊이 숨을 들이쉬었다. 가슴속의 비통함과 무력감을 누른 채 옆을 향해 불렀다.\n“사이프, 달걀 하나 가져와.”\n……"
  }
];
  window.showPrisonChildrenRescue = async (previous = null, branch = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    branch = branch || decisions.saifTrunk;
    if (!["hide","stay"].includes(branch)) return false;
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || decisions.saifTrunk !== branch)) return false;
    const overheard = {image:-1,text:"운명의 전환점은 평범하기 그지없는 한 번의 식사 배달 속에 숨어 있었다. 그날 음식을 들고 문밖에 서 있던 사이프는 우연히 방 안의 밀담을 엿들었다. 교장이 말하던 이른바 ‘중대한 임무’란, 아이들의 몸에 폭약을 묶어 미군에 보복할 ‘인간 폭탄’으로 내보내는 일이었다."};
    const pages = branch === "hide" ? sharedPages : [overheard,...sharedPages.slice(2)];
    const scene = document.createElement("section"); scene.className = "prison-children-rescue-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","아이들을 함께 데려가려는 결심");
    const art = document.createElement("div"); art.className = "prison-children-rescue-art";
    const images = [1,2,3,4].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-children-rescue-${n}.jpg`;
      img.alt = ["덜컹거리며 돌아가는 차","짐칸 안에 웅크려 우는 사이프","교장 앞에서 손을 드는 아이들","주방에서 아이들의 탈출을 의논하는 서복과 마준생"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.dataset.branch = branch;
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
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {
        if (typeof window.showPrisonEggMontage !== "function") return;
        busy = true; const moved = await window.showPrisonEggMontage(scene,{preview});
        if (!moved) busy = false; return;
      }
      index++; show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" || event.code === "Space") {event.preventDefault(); advance();}
    });
    if (pages[0].image >= 0) await images[pages[0].image].decode();
    document.body.append(scene); scene.focus({preventScroll:true});
    if (previous) previous.remove(); await show(); return true;
  };
})();
