(() => {
  "use strict";
  const texts=[
    "1년 반 후",
    "주방의 텔레비전에서는 차가운 뉴스가 흘러나오고 있었다.\n\n“오늘 오후, 대사원 주차장에서 차량 폭탄 공격이 발생해 미군 병사 3명과 민간인 6명이 사망했습니다. 당국은 특정 대상을 노린 테러 공격으로 추정하고 있으며, 전화기를 이용한 원격 조종으로 실행됐을 가능성을 의심하고 있습니다……”",
    "바로 그날 깊은 밤, 차가운 총구와 눈부신 강한 빛이 갑자기 식당의 어둠을 찢었다. 수많은 미군이 문을 부수고 들이닥쳐, 설명할 틈도 주지 않은 채 서복을 바닥에 거칠게 눌렀다.",
    "미군이 서복을 거칠게 끌고 나가려던 순간, 주방에 있던 어린 사이프가 충혈된 눈으로 뛰쳐나왔다. 아버지처럼 여기던 스승이 붙잡히는 모습을 보자 아이는 완전히 이성을 잃었다. 도마 위의 식칼을 움켜쥐고 미군을 향해 달려들었다.\n\n하지만 역부족이었다. 차가운 개머리판이 무겁게 내리쳐졌고, 사이프는 피를 흘리며 쓰러졌다. 아이는 서복과 함께 차가운 군용 차량 안으로 밀어 넣어졌다."
];
  window.showRestaurantRaid=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="restaurant-raid-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","1년 반 후, 용식당에 들이닥친 군인들");
    const art=document.createElement("div");art.className="restaurant-raid-art";
    const images=[1,2,3,4].map((number,i)=>{const img=document.createElement("img");img.src=`../js/images/restaurant-raid-${number}.jpg`;img.alt=["1년 반 뒤, 폐허가 된 거리","뉴스에 등장한 무장한 군인","용식당으로 들어온 미군","스승을 지키려다 붙잡힌 사이프"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);await images[index].decode();
      const incoming=images[index];incoming.style.zIndex="1";await fade(incoming,0,1,850);
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});
      scene.dataset.step=index;prose.textContent=texts[index];await fade(prose,0,1,300);busy=false;
    }
    function advance(){if(busy)return;if(index===3){busy=true;window.showTonyNews(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});
    if(previous)previous.remove();show();
  };
})();
