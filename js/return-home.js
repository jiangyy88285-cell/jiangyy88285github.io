(() => {
  "use strict";
  const phone = [
    "폭발의 여파가 가라앉은 뒤, 서복은 돈을 내고 통신소를 찾아 떨리는 손으로 국제전화를 걸었다. 수화기 너머로 가족의 목소리가 들려왔다. 피와 불길로 가득한 타향에서 ‘난 괜찮아’라는 한마디를 전할 수 있다는 것만으로도 더없이 간절한 바람이었다.",
    "“외국 사람들끼리 싸우는 거야. 나랑은 상관없으니까 걱정하지 마.”\n그는 목소리를 낮췄다. 애써 담담하고 느긋한 말투를 지으며, 이마에 채 마르지 않은 식은땀을 감췄다."
  ];
  const blocked = [
    "하지만 현실은 상상보다 더 차가웠다. 전쟁이 빠르게 번지며 교통은 완전히 마비되었고, 나라 밖으로 나가는 길은 모두 막혔다.",
    "얼마 지나지 않아 적대 세력의 군대가 현지 정부를 해산시켰다. 나라는 구심점을 잃은 혼란에 빠졌고, 사회 질서는 무너져 내렸다.",
    "서복은 주머니에서 구겨진 비행기표를 꺼냈다. 반년 넘게 피땀 흘려 모은 돈으로 산 표였다. 이미 싸 놓은 짐은 이제 갈 곳 없는 처지를 비웃는 듯했다. 그는 얇은 종이를 꼭 쥔 채 씁쓸하게 고개를 저었다. 시대의 참화에 짓밟힌 이 각축장에서, 작은 요리사의 귀향은 끝내 닿을 수 없는 꿈이 되었다."
  ];
  window.showReturnHome = (previous = null) => {
    const scene = document.createElement("section"); scene.className = "return-home-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "가족에게 건 전화, 돌아갈 수 없는 길");
    scene.innerHTML = '<div class="return-home-art"><img src="../js/images/return-home-phone.png" alt="가족과 국제전화로 통화하는 서복" draggable="false"><img src="../js/images/return-home-blockade.png" alt="군대와 전차가 들어선 거리" draggable="false"><img src="../js/images/return-home-flower.jpg" alt="폐허 위에서도 뿌리를 내리는 꽃" draggable="false"></div><div class="return-home-wash"></div><p class="return-home-prose" aria-live="polite"></p><div class="tasting-choices" hidden><h2>돈을 벌어 빚을 갚는 것을 포기하고<br>집으로 돌아가시겠습니까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="home">당장 비행기표를 사서 집으로 돌아간다.</button><button type="button" class="story-option" data-choice="stay">계속 이곳에 남는다.</button></div></div>';
    const images = scene.querySelectorAll("img"), prose = scene.querySelector(".return-home-prose"), choices = scene.querySelector(".tasting-choices");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phase = "phone", index = 0, busy = true, current = null;
    async function fade(element,from,to,duration) {
      const animation = element.animate([{opacity:from},{opacity:to}],{duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await animation.finished; element.style.opacity = String(to); animation.cancel();
    }
    async function show(text,imageIndex) {
      busy = true; await fade(prose,1,0,160);
      const incoming = images[imageIndex];
      if(current !== incoming) {
        await incoming.decode(); incoming.style.zIndex = "1";
        await fade(incoming,0,1,1200);
        images.forEach(image=>{image.style.opacity=image === incoming?"1":"0";image.style.zIndex="0";});
        current = incoming;
      }
      scene.dataset.image = imageIndex; prose.textContent = text;
      await fade(prose,0,1,400); busy = false;
    }
    async function beginBlocked() {phase="blocked";index=0;await show(blocked[0],1);}
    async function advance() {
      if(busy || phase === "choice") return;
      if(phase === "end") {busy=true;window.showReopening(scene);return;}
      if(phase === "phone") {
        if(++index < phone.length) await show(phone[index],0);
        else {busy=true;await fade(prose,1,0,160);phase="choice";choices.hidden=false;busy=false;scene.focus({preventScroll:true});}
      } else if(phase === "persuaded") await beginBlocked();
      else if(phase === "blocked") {
        if(++index < blocked.length) await show(blocked[index],1);
        else {phase="end";await show("하지만 폐허 위에서도, 평범한 삶은 다시 뿌리를 내려야 했다.",2);scene.classList.add("is-complete");}
      }
    }
    choices.querySelectorAll("button").forEach(button=>button.addEventListener("click",async event=>{
      event.stopPropagation();if(busy || phase !== "choice")return;
      busy=true;choices.hidden=true;scene.focus({preventScroll:true});
      window.recordStoryDecision?.("firstHomeChoice",button.dataset.choice);
      if(button.dataset.choice === "stay") {phase="persuaded";await show("하지만 어머니와 딸의 애타는 재촉 앞에서, 서복은 결국 마음을 돌려 돌아가겠다고 했다.",0);}
      else await beginBlocked();
    }));
    scene.addEventListener("click",event=>{if(!event.target.closest("button"))advance();});
    scene.addEventListener("keydown",event=>{
      if(event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey)return;
      if(event.code === "Space" || event.key === "Enter"){event.preventDefault();advance();}
    });
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    show(phone[0],0);
  };
})();
