(() => {
  "use strict";
  const intro=[
    "식당의 운영 방식도 완전히 달라졌다. 낮에는 여전히 따뜻한 음식과 삶의 온기가 피어나는 밥집이었지만, 밤이 되면 네온과 어둑한 조명이 뒤섞이며 전쟁 속 피난처의 유일한 술집으로 변했다. 밤낮없이 이어지는 소란과 거래 덕분에 용식당은 유례없는 호황을 누렸고, 돈은 무섭게 서복의 주머니로 쏟아져 들어왔다.",
    "그 무렵, 서복은 이미 모든 빚을 갚고도 남을 만큼 돈을 벌어 놓은 상태였다."
  ];
  const branches={
    stay:["하지만 인간의 탐욕과 부에 대한 집착은 보이지 않는 밧줄처럼 그를 단단히 붙들었다. 고향으로 돌아가고 싶은 마음이 거듭 밀려와도, 그는 하루하루 큰돈이 들어오는 이 ‘명당’을 떠나지 못한 채 귀향을 미루고 또 미뤘다."],
    home:[
      "그는 이미 표를 사고 길까지 나섰다. 하지만 전황이 갑자기 악화되면서 도시를 빠져나가는 길이 완전히 봉쇄되었다. 물러설 곳이 없어진 그는 결국 용식당으로 돌아올 수밖에 없었다.",
      "서복은 하루가 다르게 돈이 쌓이는 겉모습에 판단을 잃지 않았다. 빚을 모두 갚겠다는 생각이 무엇보다 앞섰다. 그는 서둘러 일을 인계하고, 모아 둔 돈을 챙겨 밤중에 버스 터미널로 향했다. 고향으로 돌아갈 기대에 가슴이 부풀었다.",
      "그러나 운명은 그에게 잔인한 장난을 쳤다. 출발 직전, 전선의 전투가 갑자기 격화되었다. 외부로 이어지는 마지막 도로가 전면 봉쇄되었고, 고향으로 향하는 버스는 모두 운행을 멈췄다.",
      "총을 든 병사들이 지키는 검문소와 머리 위로 굉음을 내며 지나가는 전투기를 바라보며, 서복은 쓸모없어진 표를 꼭 쥔 채 씁쓸하게 웃었다. 퇴로는 끊겼다. 섬처럼 고립된 이 도시에서 그가 몸을 의지할 곳은 여전히 네온이 반짝이는 용식당뿐이었다. 그는 돌아서서 다시 밤의 소란 속으로 걸어 들어갔다."
    ]
  };
  window.showProsperityChoice=async(previous=null,startAt=0)=>{
    const scene=document.createElement("section");scene.className="prosperity-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","호황 속에서의 선택");
    scene.innerHTML='<div class="prosperity-art"><img src="../js/images/prosperity-day.jpg" alt="용식당에서 여가를 즐기는 사람들" draggable="false"><img src="../js/images/prosperity-night.jpg" alt="밤의 술집으로 가득 찬 용식당" draggable="false"></div><p class="prosperity-prose" aria-live="polite"></p><div class="tasting-choices" hidden><h2>용식당에 계속 남아<br>돈을 더 벌겠습니까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="stay">남아서 돈을 번다.</button><button type="button" class="story-option" data-choice="home">집으로 돌아가려 한다.</button></div></div>';
    const images=scene.querySelectorAll("img"),prose=scene.querySelector("p"),choices=scene.querySelector(".tasting-choices");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phase="intro",index=startAt===1?1:0,busy=true,current=null,branch=[];
    images[1].style.objectFit="cover";
    images[1].style.objectPosition="right center";
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(text,imageIndex){
      busy=true;await fade(prose,1,0,140);const incoming=images[imageIndex];
      if(current!==incoming){await incoming.decode();incoming.style.zIndex="1";await fade(incoming,0,1,850);images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});current=incoming;}
      scene.dataset.image=imageIndex;prose.textContent=text;await fade(prose,0,1,280);busy=false;
    }
    async function advance(){
      if(busy||phase==="choice")return;
      if(phase==="end"){busy=true;window.showTonyConflict(scene);return;}
      if(phase==="intro"){
        if(index===0){index=1;await show(intro[1],1);}
        else{busy=true;await fade(prose,1,0,140);phase="choice";choices.hidden=false;scene.focus({preventScroll:true});busy=false;}
      }else if(phase==="branch"){
        if(index+1<branch.length){index++;await show(branch[index],1);}
        if(index===branch.length-1){phase="end";scene.classList.add("is-complete");}
      }
    }
    choices.querySelectorAll("button").forEach(button=>button.addEventListener("click",async event=>{
      event.stopPropagation();if(busy||phase!=="choice")return;busy=true;choices.hidden=true;scene.focus({preventScroll:true});
      window.prosperityDecision=button.dataset.choice;
      try{sessionStorage.setItem("prosperityDecision",button.dataset.choice);}catch{}
      branch=branches[button.dataset.choice];index=0;phase="branch";await show(branch[0],1);
      if(branch.length===1){phase="end";scene.classList.add("is-complete");}
    }));
    scene.addEventListener("click",event=>{if(!event.target.closest("button"))advance();});
    scene.addEventListener("keydown",event=>{if(event.target.closest("button")||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();show(intro[index],index);
  };
})();
