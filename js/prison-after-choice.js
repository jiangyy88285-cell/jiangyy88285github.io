(() => {
  "use strict";
  const common=[
    {image:"xu",text:"교장은 곁에 있던 어린 사이프를 돌아보며, 앞서 서복에게 꺼냈던 이야기를 어떻게 생각하느냐고 물었다. 사이프에게는 전사의 피가 흐르니 싸우는 법을 배워야 한다는 주장이었다. 서복은 자신들이 미군을 위해 일하고 있다는 이유를 들어 사이프를 대신해 완곡하게 거절했다. 그러나 곁에 있던 소년이 갑자기 끼어들어 비웃고 빈정거렸다. 서복과 마준생이 미국인의 개 노릇을 하며 사이프까지 망쳐 놓았다는 말이었다."},
    {image:"argument",text:"마준생은 순식간에 화가 치밀어 소년에게 따져 물었다. “너희 교장 목숨도 우리 ‘개 세 마리’가 구해 준 거야! 도대체 누가 개라는 거냐?”"},
    {image:"guard",text:"말다툼이 점점 거칠어지자 소식을 듣고 달려온 미군이 실탄이 든 총을 든 채 충돌을 막았다.\n\n서복은 황급히 둘 사이에 끼어들어 웃음을 지으며 달랬다. 모두 억울하게 들어온 것이고, 머지않아 나갈 수 있을 거라고 했다."},
    {image:"saif",text:"떠나기 전, 교장은 사이프의 팔을 꽉 붙잡았다. 단호하고 집요한 눈빛으로 서복에게 말했다. “이 아이는 요리사가 될 아이가 아니오. 전사가 되어야 하오.” 서복은 사이프를 자기 쪽으로 당기며 건성으로 답했다. “우선 요리부터 잘하게 하죠.”\n\n사이프는 연신 고개를 돌려 교장의 모습을 바라보았다. 서복이 뒤에서 가볍게 밀며 말했다. “그만 봐.”\n\n그들은 그 자리를 떠났다."}
  ];
  const paths={
    fake:[
      {image:"thanks",text:"고문이 끝난 뒤, 목숨을 건진 교장은 몰래 서복을 찾아와 고마움을 전했다."},
      {image:"gold",text:"그는 귀한 금니 하나를 서복의 손에 쥐여 주었다. 서복은 연신 고맙다고 하며, 교장의 ‘연기가 훌륭해서’ 미군을 속일 수 있었다고 농담했다."},
      ...common
    ],
    real:[{image:"wide",text:"얼마 후, 알리는 고문이 끝나고 풀려나왔다."},...common]
  };
  function readChoice(){
    const live=window.storyDecisions?.chiliWater;
    if(live==="fake"||live==="real")return live;
    try{const saved=JSON.parse(sessionStorage.getItem("storyDecisions")||"{}");if(saved?.chiliWater==="fake"||saved?.chiliWater==="real")return saved.chiliWater;}catch{}
    return null;
  }
  // Preview overrides select a view only; they never overwrite the player's decision.
  window.showPrisonAfterChoice=async(previous=null,previewChoice=null)=>{
    const choice=previewChoice??readChoice();
    if(!Object.hasOwn(paths,choice))return window.showPrisonChili(previous);
    const pages=paths[choice];
    const scene=document.createElement("section");scene.className="prison-after-scene";scene.lang="ko";scene.tabIndex=-1;scene.dataset.choice=choice;
    scene.setAttribute("aria-label","선택 뒤, 교장과 사이프의 갈등");
    const art=document.createElement("div");art.className="prison-after-art";
    const alts={thanks:"몰래 서복에게 고마움을 전하는 알리",gold:"손바닥에 놓인 금니",wide:"고문 뒤 수감자들이 있는 교도소",xu:"교장의 제안을 듣는 서복",argument:"사이프를 둘러싼 수감자들의 말다툼",guard:"철망 위에서 총을 든 미군",saif:"교장을 돌아보는 사이프"};
    const images=new Map();
    for(const {image:name} of pages){
      if(images.has(name))continue;
      const img=document.createElement("img");img.src=`../js/images/prison-after-${name}.${name==="saif"?"png":"jpg"}`;img.alt=alts[name];img.draggable=false;
      images.set(name,img);art.append(img);
    }
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=null;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);
      const page=pages[index],incoming=images.get(page.image);
      if(current!==incoming){await incoming.decode();incoming.style.zIndex="1";await fade(incoming,0,1,850);for(const img of images.values()){img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";}current=incoming;}
      scene.dataset.image=page.image;scene.dataset.step=String(index);prose.textContent=page.text;await fade(prose,0,1,300);busy=false;
    }
    function advance(){if(busy)return;if(index===pages.length-1){busy=true;window.showPrisonMessage(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images.get(pages[0].image).decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();
  };
})();
