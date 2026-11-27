(() => {
  "use strict";
  const texts=[
    "식탁 위에는 숨 막힐 듯한 긴장감이 감돌았다.",
    "고집 센 어린 사이프는 적의에 찬 눈으로 상대를 줄곧 노려보았고, 미군 장교는 크게 화를 냈다. 공교롭게도 그는 중국계 미군이었다. 서복은 서둘러 나서서 분위기를 달랬다. 사이프의 고개를 눌러 얼른 방으로 돌아가 자라고 하면서, 장교에게는 웃으며 좋은 말로 사과하고 진정시켰다.",
    "소란이 지나간 뒤, 서복은 홀에 홀로 앉아 술잔을 기울였다. 그때 왕토니가 서복의 손에 들린 술병을 눈여겨보았다. 엄격하게 술을 금하는 이곳에서 술 한 병은 더없이 귀한 보물이나 다름없었다. 왕토니는 가진 현금을 모두 꺼내 탁자에 내려놓으며, 그 술을 꼭 사겠다고 졸랐다.\n\n어둑한 식당 안에 담배 연기와 술 향이 퍼졌다. 타향을 떠돌던 두 사람은 술잔을 주고받으며 가까워졌다. 한편 서복은 전쟁과 금주령에 묶인 이 땅에서, 어둠 속에 숨은 거대한 사업 기회의 냄새를 맡았다."
];
  window.showOfficersMeal=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="officers-meal-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","식탁의 긴장과 술 한 병의 기회");
    const art=document.createElement("div");art.className="officers-meal-art";
    const images=[1,2,3].map((number,i)=>{const img=document.createElement("img");img.src=`../js/images/officers-meal-${number}.jpg`;img.alt=["긴장 속에서 식사하는 장교들","사이프를 달래는 서복","술병을 두고 이야기를 나누는 사람들"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);await images[index].decode();
      const incoming=images[index];incoming.style.zIndex="1";await fade(incoming,0,1,850);
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});
      scene.dataset.step=index;prose.textContent=texts[index];await fade(prose,0,1,300);busy=false;
      if(index===2)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===2){busy=true;window.showTruckDeparture(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});
    if(previous)previous.remove();show();
  };
})();
