(() => {
  "use strict";
  // This chapter is shared by all paths; it never changes earlier decisions.
  const pages=[
    {image:0,text:"뚜…… 뚜…… 뚜……"},
    {image:1,text:"오랫동안 닿지 않았던 전화가 긴 신호음 끝에 마침내 연결되었다. 수화기 너머로 그리운 고향 말이 들려오자 서복은 순식간에 눈시울이 붉어지고 목이 메었다."},
    {image:1,text:"“여보세요?” 어머니의 목소리였다.\n“여보세요.”\n“누구세요?”\n“저예요, 엄마.”\n“복이니?”\n“엄마 아들이요.”\n“내 아들?”\n“저예요, 엄마.”"},
    {image:1,text:"“서복, 이제야 집에 전화할 생각이 들었니? 반년이 넘도록 소식이 없어서 우리가 얼마나 애를 태웠는지 알아?”\n\n“엄마, 여기 사정이 좀 있어서요. 전화할 수가 없었어요. 괜찮아요. 곧 돌아갈 거예요.”"},
    {image:1,text:"“얼마나 놀랐는지 아니.”\n“걱정 끼쳐 드렸어요.”\n\n“잠깐만. 러러야, 러러! 빨리 와! 네 아빠 전화야, 빨리!”"},
    {image:1,text:"“아빠.”\n“러러, 아빠 보고 싶었어? 아직도 아빠한테 화났니?”\n“응?”\n\n“화가 났냐고? 난 아빠가 죽은 줄 알았어! 어디 갔던 거야, 아빠? 나랑 할머니가 얼마나 많은 사람한테 부탁해서 찾았는지 알아? 여기도 소식이 없고 저기도 소식이 없고. 난 아빠가 죽은 줄 알았다고!”"},
    {image:1,text:"“미안해, 딸. 아빠한테 사정이 좀 있었어. 며칠 뒤면 돌아가. 열흘 좀 넘게 걸리려나.”\n\n“무슨 사정이길래 전화도 못 해? 아빠…… 나 버린 거야?”\n\n“쓸데없는 소리 하지 마. 아빠가 널 버리고 누굴 택하겠어?”"},
    {image:1,text:"“시간 다 됐습니다.” 옆에서 미군이 재촉했다.\n\n“2년이면 돌아온다고 약속했잖아.”\n“보름만 더 기다려 줘.”\n“또 보름이나 기다리라고? 서복, 내 말 들어……”"},
    {image:1,text:"“아빠한테 주어진 시간이 전부 1분이야. 이제 곧 끊어야 해.”"},
    {image:1,text:"곧 옆에 있던 미군이 강제로 전화를 끊었다. 서복은 차가운 수화기를 움켜쥐었다. 반년 넘게 억눌러 온 감정이 한꺼번에 무너져 내렸다. 그는 두 손으로 얼굴을 감싸고 목 놓아 울었다."},
    {image:2,text:"옆에 있던 마준생도 기대에 부풀어 번호를 눌렀다. 그러나 수화기에서는 죽음 같은 침묵 속에 아무도 받지 않는 신호만 이어졌다——"},
    {image:3,text:"그는 알지 못했다. 용식당에는 이미 봉인 딱지가 붙어 있었다. 타국에서 그의 소식을 애타게 기다리던 리나는 무력한 심정으로 이곳저곳에 그의 행방을 물었다. 그를 찾는 일을 한 번도 포기하지 않았다."},
    {image:4,text:"아무도 전화를 받지 않았지만, 그때만 해도 그들은 괜찮다고 생각했다. 이제 곧 집에 돌아갈 수 있을 테니까."}
  ];
  window.showPrisonHomeCall=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="prison-home-call-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","가족과의 1분 통화");
    const art=document.createElement("div");art.className="prison-home-call-art";
    const images=[1,2,3,4,5].map((n,i)=>{const img=document.createElement("img");img.src=`../js/images/prison-home-call-${n}.jpg`;img.alt=["수화기를 들고 신호음을 기다리는 서복","가족의 목소리를 듣고 눈물을 흘리는 서복","응답 없는 전화를 기다리는 마준생","텅 빈 용식당","함께했던 사람들의 단체 사진"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=-1;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);const page=pages[index],incoming=images[page.image];
      if(current!==page.image){await incoming.decode();incoming.style.zIndex="1";await fade(incoming,0,1,850);incoming.style.zIndex="0";images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";});current=page.image;}
      scene.dataset.image=String(page.image);scene.dataset.step=String(index);prose.textContent=page.text;await fade(prose,0,1,300);busy=false;
    }
    function advance(){if(busy)return;if(index===pages.length-1){busy=true;window.showPrisonChristmas(scene);return;}index++;show();}
    scene.addEventListener("click",advance);scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();return true;
  };
})();
