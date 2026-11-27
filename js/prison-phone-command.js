(() => {
  "use strict";
  const pages = [
  {
    "image": 0,
    "text": "“이봐, 꼬마!” 검문소의 미군이 이상을 알아채고 크게 외쳤다. “꼬마야, 뭐 하는 거야? 이쪽 봐! 묻잖아. 가방 안에 뭐가 있지?”\n\n그제야 자말이 떨며 천천히 고개를 들었다. 극도의 공포와 절망이 서린 눈빛을 본 미군은 곧바로 위험을 감지했다. 총을 겨누고 물러나라고 날카롭게 외쳤다.\n“움직이지 마! 당장 가방 내려놔!”\n\n줄을 서 있던 민간인들이 순식간에 공포에 휩싸였다. 미군은 침착함을 유지하며 아이를 달래려 했다.\n“가방을 땅에 내려놔. 천천히.”\n자말은 핏기 없는 얼굴로 가방을 천천히 바닥에 내려놓았다.\n“이제 두 손 들어.”"
  },
  {
    "image": 1,
    "text": "한편 차 안의 장교는 이 모든 광경을 냉담하게 지켜보며 천천히 휴대전화를 꺼내 숫자를 입력하기 시작했다."
  },
  {
    "image": 0,
    "text": "“안에 대체 뭐가 들었지?” 미군이 날카롭게 추궁했다.\n\n“저…… 저도 몰라요.” 자말은 온몸이 식은땀으로 젖은 채 떨리는 목소리로 대답했다.\n\n“날 봐!”"
  },
  {
    "image": 2,
    "text": "“정말 몰라요……”\n\n자말은 눈물이 고인 눈으로 사람들 너머, 자신을 속인 장교를 멀리 바라보았다."
  },
  {
    "image": 1,
    "text": "“삐, 삐, 삐……”\n휴대전화의 암호 입력이 끝났다.\n“뚜—” 하고 맑은 알림음이 울렸다."
  }
];
  window.showPrisonPhoneCommand = async (previous = null, {preview = false} = {}) => {
    let saved = {};
    try {saved = JSON.parse(sessionStorage.getItem("storyDecisions") || "{}");} catch {}
    const decisions = {...saved,...window.storyDecisions};
    if (!preview && (decisions.chiliWater !== "fake" || decisions.grenadeChoice !== "throw" || decisions.saifTrunk !== "hide")) return false;
    const scene = document.createElement("section"); scene.className = "prison-phone-command-scene";
    scene.lang = "ko"; scene.tabIndex = -1; scene.setAttribute("aria-label","검문소의 자말과 장교의 휴대전화");
    const art = document.createElement("div"); art.className = "prison-phone-command-art";
    const images = [1,2,3].map((n,i) => {
      const img = document.createElement("img"); img.src = `../js/images/prison-phone-command-${n}.jpg`;
      img.alt = ["자말을 향해 총을 겨누는 검문소의 미군들","장교가 손에 든 휴대전화","눈물을 흘리며 장교를 바라보는 자말"][i];
      img.draggable = false; art.append(img); return img;
    });
    const prose = document.createElement("p"); prose.setAttribute("aria-live","polite"); scene.append(art,prose);
    const phoneDisplay = document.createElementNS("http://www.w3.org/2000/svg","svg");
    phoneDisplay.classList.add("phone-command-display");
    phoneDisplay.setAttribute("viewBox","0 0 2398 1128");
    phoneDisplay.setAttribute("preserveAspectRatio","xMidYMid slice");
    phoneDisplay.setAttribute("aria-hidden","true");
    const digits = document.createElementNS("http://www.w3.org/2000/svg","text");
    digits.setAttribute("transform","translate(1535 465) rotate(39)");
    digits.setAttribute("text-anchor","middle");
    digits.setAttribute("font-family","monospace"); digits.setAttribute("font-size","48");
    digits.setAttribute("fill","#183b65");
    phoneDisplay.append(digits); art.append(phoneDisplay);
    let audio = null;
    function unlockAudio() {
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!audio && Audio) audio = new Audio();
        if (audio?.state === "suspended") audio.resume().catch(() => {});
      } catch {}
    }
    function beep(frequency,duration) {
      if (!audio || audio.state !== "running") return;
      try {
        const tone = audio.createOscillator(), gain = audio.createGain(), now = audio.currentTime;
        tone.type = "sine"; tone.frequency.value = frequency;
        gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime(0.065,now+0.008);
        gain.gain.setValueAtTime(0.065,now+duration-0.025); gain.gain.linearRampToValueAtTime(0,now+duration);
        tone.connect(gain); gain.connect(audio.destination); tone.start(now); tone.stop(now+duration);
        tone.onended = () => {tone.disconnect(); gain.disconnect();};
      } catch {}
    }
    async function typeDigits(final) {
      const number = "73180642";
      const start = final ? 4 : 0, end = final ? number.length : 4;
      digits.textContent = number.slice(0,start);
      for (let n = start+1; n <= end; n++) {
        digits.textContent = number.slice(0,n);
        if (final) beep(1100,0.09);
        if (!reduced) await new Promise(resolve => setTimeout(resolve,320));
      }
      if (final) beep(760,0.35);
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, current = -1, busy = true;
    async function fade(el,from,to,duration) {
      const animation = el.animate([{opacity:from},{opacity:to}],{duration:reduced ? 0 : duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; el.style.opacity = String(to); animation.cancel();
    }
    async function show() {
      busy = true; await fade(prose,1,0,180); const page = pages[index];
      scene.dataset.image = String(page.image); scene.dataset.step = String(index);
      phoneDisplay.style.opacity = "0";
      if (current !== page.image) {
        const incoming = images[page.image]; await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1000);
        images.forEach(img => {img.style.opacity = img === incoming ? "1" : "0"; img.style.zIndex = "0";}); current = page.image;
      }
      prose.textContent = page.text; await fade(prose,0,1,400);
      if (page.image === 1) {phoneDisplay.style.opacity = "1"; await typeDigits(index === pages.length-1);}
      scene.dataset.phase = index === pages.length - 1 ? "complete" : "story"; busy = false;
    }
    async function advance() {
      if (busy) return;
      if (index === pages.length - 1) {
        if (typeof window.showPrisonStreetExplosion !== "function") return;
        busy = true; const moved = await window.showPrisonStreetExplosion(scene,{preview});
        if (!moved) busy = false; return;
      }
      unlockAudio(); index++; show();
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
