(() => {
  "use strict";
  const dialogue=[
    [0,"“중화 요리의 혼! 어때요, 엄마? 사장님이 선물해 준 거예요.”\n“요리의 혼은 무슨. 네 작은 식당도 망하게 했으면서.”\n“지금은 그때랑 다르죠. 완전히 달라요.”"],
    [1,"“자, 보세요. 자이드예요. 제 동업자죠. 수도·전력 부처의 높은 분이에요. 차관쯤 된다고 할까요.”\n“인상이 썩 좋진 않네. 좋은 사람 같지 않아.”\n“그런 말 마세요. 여기 사람들 중국어를 조금씩은 알아들어요.”"],
    [2,"“어머, 대낮에 뭐 하는 거니?”\n“하하, 마준생이에요. 제 매니저요. 광시 출신이에요. 이쪽은 그 아내 리나고요.”\n“어머님, 안녕하세요!”"],
    [2,"“그래, 둘 다 안녕. 아가씨 참 곱게 생겼네. 짙은 눈썹에 큰 눈이 얼마나 예뻐.”\n“자, 두 분은 계속 다정하게 계세요.”"],
    [3,"“이쪽은 미국 친구 토니예요. 토니라는 이름이 질척질척하다는 말이랑 비슷하죠. 컴퓨터는 이 친구한테 빌렸어요.”\n“토니, 우리 엄마한테 인사해요.”\n“중국 청년 아니니?”\n“해외 동포예요.”\n“어머님, 안녕하세요!”"],
    [3,"“이제 1분 남았어요. 교대하러 가야 해요.”"],
    [4,"“여기 아이들이 스무 명 넘게 있어요. 엄마, 전에는 거리에서 지내던 애들이었는데 지금은 다 제 식당 종업원이에요.”\n“아동 노동? 그거 불법이야.”"],
    [4,"“맞아요. 법에 걸릴까 봐 돈은 한 푼도 안 줬어요. 대신 숙소를 빌려서 먹이고 재워 줘요. 자, 할머니께 인사해.”\n“할머니, 안녕하세요!”\n“얘들아, 안녕!”"],
    [5,"그때 서복의 딸 서러가 집에 돌아왔다.\n“다녀왔어요, 할머니.”\n“러러야, 네 아빠야.”\n“러러, 학교 끝났어? 아빠가 얼마나 보고 싶었는지 아니? 얼른 아빠랑 얘기 좀 하자.”"],
    [5,"서러는 “숙제하러 갈게요, 할머니.”라는 말만 남겼다.\n“아빠랑 잠깐 얘기하고 하면 안 되니? 그렇게 급해, 딸?”\n“아직 너한테 화가 났나 보다.”"],
    [5,"“우리 집 빚은 다 갚은 거 아니니? 류 씨도 퇴원했잖아. 너도 이제 돌아와야 하지 않겠니?”"],
    [5,"decision"],
    [5,"“알겠다. 안 돌아오겠다는 거지? 돈이 사람보다 중요하다 이거구나.”\n“왜 그런 말을 해요? 러러한테 보고 싶다고 꼭 전해 줘요. 앞으로 한 달에 한 번 영상통화할게요. 다음에는 꼭 저랑 얘기하게 해 주세요.”"],
    [5,"“내가 얘기해 볼게. 컴퓨터 돌려줘야 하는 거 아니니? 끊자.”\n“네. 두 분 밥 잘 챙겨 드세요.”\n“그래, 너도.”"]
  ];
  // These bounds exclude the original subtitle bands and printed borders.
  const crops=[[8,0,.994,.849],[14,102,.984,.798],[8,0,.994,.859],[8,0,.994,.859],[8,0,.994,.842],[8,0,.994,.849]];
  window.showFamilyVideoCall=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="family-call-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","어머니와의 영상통화");
    const pictures=Array.from({length:6},(_,i)=>{const img=new Image();img.src=`../js/images/family-call-${i+1}.jpg`;return img;});
    const stage=document.createElement("div");stage.className="family-call-stage";stage.hidden=true;
    const canvas=document.createElement("canvas");canvas.setAttribute("role","img");canvas.setAttribute("aria-label","왼쪽에는 서복과 식당 사람들, 오른쪽에는 어머니가 보이는 영상통화");
    const leftCurtain=document.createElement("div"),rightCurtain=document.createElement("div");leftCurtain.className="family-call-curtain is-left";rightCurtain.className="family-call-curtain is-right";
    stage.append(canvas,leftCurtain,rightCurtain);
    const prose=document.createElement("p");prose.className="family-call-prose is-dialing";prose.setAttribute("aria-live","polite");prose.textContent="뚜르르…… 뚜르르……";
    scene.append(stage,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=-1,busy=true,current=-1,finished=false;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    function draw(){
      if(current<0)return;
      const img=pictures[current],[x,y,w,h]=crops[current],sw=img.naturalWidth*w,sh=img.naturalHeight*h;
      canvas.width=Math.round(sw);canvas.height=Math.round(sh);stage.style.aspectRatio=`${sw}/${sh}`;
      canvas.getContext("2d").drawImage(img,x,y,sw,sh,0,0,canvas.width,canvas.height);
    }
    function answer(){
      let choice=window.prosperityDecision;
      try{choice=choice||sessionStorage.getItem("prosperityDecision");}catch{}
      return choice==="home"?"“엄마, 지금 전쟁 중이잖아요. 당장은 나갈 수가 없어요. 그래서 여기 남아 조금 더 벌려고요.”":"“엄마, 지금 우리 식당은 매일 줄을 서요. 지금 떠나면 너무 아깝잖아요. 한창 돈이 벌릴 때인데요.”";
    }
    async function show(){
      busy=true;await fade(prose,1,0,140);
      const [imageIndex,text]=dialogue[index];
      if(current!==imageIndex){
        await pictures[imageIndex].decode();
        if(current>=0)await fade(stage,1,0,250);
        current=imageIndex;draw();stage.hidden=false;await fade(stage,0,1,650);
      }
      prose.classList.remove("is-dialing");prose.textContent=text==="decision"?answer():text;
      await fade(prose,0,1,250);busy=false;
    }
    async function hangUp(){
      busy=true;await fade(prose,1,0,250);
      await fade(rightCurtain,0,1,1100);
      await fade(leftCurtain,0,0,1100);
      await fade(leftCurtain,0,1,1100);
      stage.hidden=true;finished=true;busy=false;scene.classList.add("is-complete");scene.setAttribute("aria-label","영상통화가 끝난 푸른 화면");
    }
    function advance(){if(busy)return;if(finished){busy=true;window.showZaAttack(scene);return;}if(index===dialogue.length-1){hangUp();return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    document.body.append(scene);scene.focus({preventScroll:true});
    if(previous){await fade(previous,1,0,650);previous.remove();}
    await fade(prose,0,1,650);busy=false;
  };
})();
