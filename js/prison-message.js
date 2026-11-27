(() => {
  "use strict";
  const pages=[
    {image:0,text:"그들이 떠난 뒤, 한 수감자가 찾아왔다. “공학자가 보낸 편지입니다.” 그는 단단히 접은 비밀 쪽지를 서복의 손바닥에 몰래 쥐여 주었다."},
    {image:1,text:"그 무렵, 사이프는 운동장으로 나왔다. 함께 갇혀 있던 소년이 막 나온 사이프를 붙잡았다."},
    {image:2,text:"소년의 이름은 자말이었다. 자말은 낮은 목소리로 비밀 하나를 털어놓았다. 잔혹한 고문을 일삼는 그 미군 장교는 매주 금요일 밤 열 시면 샤워를 하러 갔다. 부대 욕실을 청소하는 수감자들은 모두 그를 위해 잔업을 해야 했다. 하지만 그것은 그들에게 기회이기도 했다.\n\n“다음에 청소하러 갈 때 그 녀석 바지 가랑이에 고춧가루를 뿌릴 거야. 이틀은 침대에서 못 일어날걸!”"},
    {image:2,text:"사이프는 망설이며 목소리를 낮췄다. “스승님이 아시면 분명 화내실 거야.” 자말이 곧바로 쏘아붙였다. “그게 무슨 상관이야? 교장님은 우리가 총을 들면 전사지만, 내려놓으면 총알받이밖에 안 된댔어. 난 총알받이가 되기 싫어. 네 마음대로 해.”\n\n사이프는 혼란스러운 듯 되물었다. “그런데 고춧가루도 총이라고 할 수 있어?”"},
    {image:3,text:"자말은 사이프에게 고춧가루 한 줌을 건넸다. 눈빛은 차갑고 단호했다. “갖게 될 거야. 우리도 나중에는 총을 갖게 될 거야.”"}
  ];
  const goText="이윽고 두 아이의 얼굴에 약속이라도 한 듯, 복수의 뜻을 품은 미소가 떠올랐다.";
  function saveChoice(value){
    let saved={};try{saved=JSON.parse(sessionStorage.getItem("storyDecisions")||"{}");}catch{}
    const valid=saved&&typeof saved==="object"&&!Array.isArray(saved)?saved:{};
    window.storyDecisions={...valid,...window.storyDecisions,chiliRetaliation:value};
    try{sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));}catch{}
  }
  window.showPrisonMessage=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="prison-message-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","비밀 편지와 사이프의 선택");
    const art=document.createElement("div");art.className="prison-message-art";
    const images=[1,2,3,4].map((n,i)=>{const img=document.createElement("img");img.src=`../js/images/prison-message-${n}.${n===4?"png":"jpg"}`;img.alt=["손바닥에 몰래 건네는 쪽지","교도소 운동장에 나온 사이프","운동장에서 마주 앉아 이야기하는 두 소년","사이프에게 고춧가루를 건네는 손"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.className="prison-message-prose";prose.setAttribute("aria-live","polite");
    const choices=document.createElement("div");choices.className="tasting-choices";choices.hidden=true;
    choices.innerHTML='<h2>고춧가루를 뿌리러 가겠습니까?</h2><div class="tasting-choice-row"><button type="button" class="story-option" data-choice="go">간다.</button><button type="button" class="story-option" data-choice="decline">가지 않는다.</button></div>';
    scene.append(art,prose,choices);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=-1,phase="intro";
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(text,imageIndex){
      busy=true;await fade(prose,1,0,140);
      if(current!==imageIndex){await images[imageIndex].decode();images[imageIndex].style.zIndex="1";await fade(images[imageIndex],0,1,850);images.forEach((img,i)=>{img.style.opacity=i===imageIndex?"1":"0";img.style.zIndex="0";});current=imageIndex;}
      scene.dataset.image=String(imageIndex);scene.dataset.step=String(index);prose.textContent=text;await fade(prose,0,1,300);busy=false;
    }
    async function advance(){
      if(busy)return;
      if(phase==="complete"){busy=true;const result=await window.showPrisonRetaliation(scene);if(result===false)busy=false;return;}
      if(phase!=="intro")return;
      if(index<pages.length-1){index++;await show(pages[index].text,pages[index].image);return;}
      busy=true;await fade(prose,1,0,160);phase="choice";choices.hidden=false;scene.focus({preventScroll:true});busy=false;
    }
    choices.querySelectorAll("button").forEach(button=>button.addEventListener("click",async event=>{
      event.stopPropagation();if(busy||phase!=="choice")return;busy=true;
      const value=button.dataset.choice;saveChoice(value);scene.dataset.choice=value;
      choices.hidden=true;scene.focus({preventScroll:true});phase="complete";
      if(value==="go")await show(goText,3);
      else{prose.textContent="";const result=await window.showPrisonRetaliation(scene);if(result===false)busy=false;}
    }));
    scene.addEventListener("click",event=>{if(!event.target.closest("button"))advance();});
    scene.addEventListener("keydown",event=>{if(event.target.closest("button")||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show(pages[0].text,0);
  };
})();
