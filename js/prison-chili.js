(() => {
  "use strict";
  const pages=[
    "햇빛 한 줄기 들지 않는 감옥에 갇힌 서복에게는 외교적 보호조차 없었다. 대사관도 가족도 그의 행방을 전혀 알지 못했다. 그들은 매일 미군 장교들의 식사를 준비하는 일 말고도, 또 다른 것을 비밀리에 만들라는 요구를 받았다.",
    "“모건 장교님, 고추 물 가져왔습니다.” 서복은 조심스럽게 수레를 밀고 다가가 특제 고추 물이 든 커다란 통을 모건의 발치에 내려놓았다. 모건은 하던 일을 멈추고 차갑게 돌아보았다. “뭔가 잊은 것 같은데?” “제 음식 말씀이십니까?” “그래, 햄버거.” 서복은 황급히 대답했지만 시선을 취조실 안으로 들었다가 그 자리에 굳어 버렸다. 차가운 철창 틈 너머에서 장교가 한 수감자에게 가혹한 고문을 가하고 있었다.",
    "서복의 시선을 알아챈 미군은 고개를 돌려 장난스럽고 비웃는 듯한 미소를 지었다. 안에 들어와 ‘공연’을 구경하겠느냐는 도발이었다. 서복은 온몸이 굳어 얼른 고개를 숙이고 시선을 피했다. 당황한 채 손을 비비며 연신 말했다. “죄송합니다, 장교님! 감사합니다, 장교님! 그럼 가 보겠습니다!” 그는 고개를 숙인 채 서둘러 복도로 물러났다.",
    "고문당하던 남자의 이름은 알리였다. 이 지역에서 악명 높은 군벌로, 극단적인 행보 때문에 어느 세력에도 받아들여지지 않았다. 학교를 세워 전사를 길러 낸다는 이유로 ‘교장’이라는 암호명으로 불렸다. 미군의 가혹한 고문에도 교장은 끝내 이를 악문 채 아무 말도 하지 않았다."
  ];
  const fakeText="연민을 느낀 서복은 미군이 고문에 쓸 액체를 만들라고 했을 때 몰래 손을 썼다. 알리를 위해 진짜가 아닌 가짜 고추 물을 만들어 주었다.";
  // Keep chiliWater through shared scenes: the later prison raid routes by this choice.
  function recordChoice(value){
    let saved={};try{saved=JSON.parse(sessionStorage.getItem("storyDecisions")||"{}");}catch{}
    const valid=saved&&typeof saved==="object"&&!Array.isArray(saved)?saved:{};
    window.storyDecisions={...valid,...window.storyDecisions,chiliWater:value};
    try{sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));}catch{}
  }
  window.showPrisonChili=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="prison-chili-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","철창 너머의 알리와 서복의 선택");
    const art=document.createElement("div");art.className="prison-chili-art";
    const images=[1,2,3].map((n,i)=>{const img=document.createElement("img");img.src=`../js/images/prison-chili-${n}.jpg`;img.alt=["주방의 큰 냄비와 고추","철창 너머를 바라보는 서복","팔을 든 채 붙잡혀 있는 알리"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.className="prison-chili-prose";prose.setAttribute("aria-live","polite");
    const choices=document.createElement("div");choices.className="tasting-choices";choices.hidden=true;
    choices.innerHTML='<h2>서복은 그 광경을 보고 연민을 느꼈다.</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="fake">가짜 고추 물을 만든다.</button><button type="button" class="story-option" data-choice="real">책임을 추궁당할까 두려워<br>진짜 고추 물을 만든다.</button></div>';
    scene.append(art,prose,choices);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=-1,phase="intro";
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(text,imageIndex){
      busy=true;await fade(prose,1,0,140);
      if(current!==imageIndex){await images[imageIndex].decode();images[imageIndex].style.zIndex="1";await fade(images[imageIndex],0,1,850);images.forEach((img,i)=>{img.style.opacity=i===imageIndex?"1":"0";img.style.zIndex="0";});current=imageIndex;}
      scene.dataset.step=String(index);prose.textContent=text;await fade(prose,0,1,300);busy=false;
    }
    async function advance(){
      if(busy)return;
      if(phase==="complete"){busy=true;await window.showPrisonAfterChoice(scene);return;}
      if(phase!=="intro")return;
      if(index<pages.length-1){index++;await show(pages[index],Math.min(index,2));return;}
      busy=true;await fade(prose,1,0,160);phase="choice";choices.hidden=false;scene.focus({preventScroll:true});busy=false;
    }
    choices.querySelectorAll("button").forEach(button=>button.addEventListener("click",async event=>{
      event.stopPropagation();if(busy||phase!=="choice")return;busy=true;
      const value=button.dataset.choice;recordChoice(value);scene.dataset.choice=value;
      choices.hidden=true;scene.focus({preventScroll:true});phase="complete";
      if(value==="fake")await show(fakeText,2);
      else{prose.textContent="";await window.showPrisonAfterChoice(scene);}
    }));
    scene.addEventListener("click",event=>{if(!event.target.closest("button"))advance();});
    scene.addEventListener("keydown",event=>{if(event.target.closest("button")||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show(pages[0],0);
  };
})();
