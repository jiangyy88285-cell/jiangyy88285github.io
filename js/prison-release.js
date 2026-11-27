(() => {
  "use strict";
  const ward=[
    {image:"rice",text:"사건이 지나고, 서복은 병실에 누워 있었다. “덮밥이라고 대충 만들어도 되는 줄 알아? 채소가 많으면 물을 적게 넣으라고 몇 번이나 말했어. 이건 완전히 죽이잖아. 정신을 어디다 두고 다니는 거야?”"},
    {image:"ward",text:"사이프는 얻어맞아 퉁퉁 부은 서복의 눈을 보더니 참지 못하고 입술을 꾹 다문 채 피식 웃었다. 서복이 못마땅하게 흘겨보았다. “재미있냐?”\n\n그러고는 옆에서 부러진 코에 붕대를 감고 있던 마준생을 가리켰다. “마음도 안 아파? 다 네가 남의 바지 가랑이에 고춧가루를 발라서 그런 거잖아!”"},
    {image:"ward",text:"서복이 정말 화가 난 것을 보고 마준생은 얼른 사이프를 토닥이며 사과하라는 눈짓을 보냈다.\n\n“죄송해요, 스승님. 제가 잘못했어요.”\n\n“됐어, 됐어. 용서해 줘. 누구나 가끔 남의 꾐에 넘어갈 때도 있잖아?” 마준생이 옆에서 분위기를 누그러뜨렸다."},
    {image:"ward",text:"서복은 어린 제자를 바라보며 아직도 가슴이 서늘한 듯 한숨을 쉬었다. “이 녀석아, 아까 그 칼이 쇠사슬에 묶여 있지 않았으면 넌 오늘 사람을 죽였을 거야. 알아?”\n\n사이프는 코를 세게 훌쩍였다. 눈에는 고집과 차가운 증오가 서려 있었다. “하지만 그 사람이 스승님을 때렸잖아요! 또 때리면 전 반드시 그 사람을 죽일 거예요!”"}
  ];
  const officerGreeting="“안녕하세요. 좀 어떠십니까?”\n\n“괜찮습니다. 감사합니다. 장교님은요?” 서복이 조용히 대답했다.\n\n“저도 좋습니다.”";
  const shared=[
    {image:"officer",text:"“조사 결과가 나왔습니다. 연합군 지상사령부에서 여러분에 대한 모든 혐의를 철회했습니다. 축하합니다. 이제 자유입니다.” 장교가 옅게 웃었다. “제가 석방 명령서에 서명만 하면 됩니다.”\n\n“지금 해 주세요. 부탁드립니다.” 서복의 목소리에는 애원이 가득했다."},
    {image:"officer",text:"“서두르지 마세요. 곧 크리스마스잖습니까. 동료들을 저녁 식사에 초대했는데, 크리스마스이브의 요리사가 되어 주셨으면 합니다.”\n\n“하지만 저희는 하루라도 빨리 집에 가고 싶습니다.”"},
    {image:"officer",text:"장교는 두 손을 벌렸다. “그렇다면 저는 수도에 가서 크리스마스를 보내야겠군요. 가는 김에 연말 업무 보고도 하고요. 부탁을 거절하시면, 빨라도 내년 2월에 돌아와야 서명할 수 있을 겁니다. 어떻습니까?”"},
    {image:"officer",text:"어쩔 수 없이 서복은 한발 물러섰다. “알겠습니다. 대신 먼저 가족에게 전화하게 해 주실 수 있습니까? 딱 1분만요.”\n\n재회를 향한 간절한 열망으로 빛나는 서복의 눈을 본 장교는 그 자리에 서서 잠시 망설였다. 이윽고 가볍게 고개를 끄덕였다."}
  ];
  const paths={
    go:[...ward,
      {image:"officer",text:"바로 그때, 장교가 들어왔다.\n\n"+officerGreeting},
      {image:"officer",text:"“모건과 이야기했습니다. 다시는 당신을 괴롭히지 않을 겁니다. 그 사람 사정도 이해해 주세요. 테러 공격으로 가족을 모두 잃었습니다. 그래서 테러범을 극도로 증오합니다.”\n\n서복은 고개를 들고 단호하게 답했다. “우리는 테러범이 아닙니다.”\n\n“알고 있습니다.”"},
      ...shared
    ],
    decline:[{image:"officer",text:"또 몇 달이 지났는지도 모를 무렵, 장교가 들어왔다.\n\n"+officerGreeting},...shared]
  };
  function readChoice(){
    const live=window.storyDecisions?.chiliRetaliation;if(live==="go"||live==="decline")return live;
    try{const value=JSON.parse(sessionStorage.getItem("storyDecisions")||"{}").chiliRetaliation;if(value==="go"||value==="decline")return value;}catch{}
    return null;
  }
  window.showPrisonNextChapter=async(previous=null,previewChoice=null)=>{
    const choice=previewChoice??readChoice();
    if(!Object.hasOwn(paths,choice))return window.showPrisonMessage(previous);
    const pages=paths[choice];
    const scene=document.createElement("section");scene.className="prison-release-scene";scene.lang="ko";scene.tabIndex=-1;scene.dataset.choice=choice;
    scene.setAttribute("aria-label",choice==="go"?"병실의 대화와 미뤄진 석방":"몇 달 뒤, 미뤄진 석방");
    const art=document.createElement("div");art.className="prison-release-art";
    const images=new Map();const alts={rice:"병실에서 먹는 덮밥",ward:"서복과 마준생을 찾아온 사이프",officer:"서복에게 석방 소식을 전하는 장교"};
    for(const {image:name} of pages){if(images.has(name))continue;const img=document.createElement("img");img.src=`../js/images/prison-release-${name}.jpg`;img.alt=alts[name];img.draggable=false;art.append(img);images.set(name,img);}
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=null;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);const page=pages[index],incoming=images.get(page.image);
      if(current!==incoming){await incoming.decode();incoming.style.zIndex="1";await fade(incoming,0,1,850);incoming.style.zIndex="0";for(const img of images.values())img.style.opacity=img===incoming?"1":"0";current=incoming;}
      scene.dataset.image=page.image;scene.dataset.step=String(index);prose.textContent=page.text;await fade(prose,0,1,300);busy=false;
    }
    function advance(){if(busy)return;if(index===pages.length-1){busy=true;window.showPrisonHomeCall(scene);return;}index++;show();}
    scene.addEventListener("click",advance);scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images.get(pages[0].image).decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();return true;
  };
})();
