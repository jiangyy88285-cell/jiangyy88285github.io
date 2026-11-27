(() => {
  "use strict";
  const texts=[
    "깊은 밤, 주방 불빛 아래에서 서복은 지폐 뭉치를 세며 부가 주는 헛된 만족감에 빠져 있었다. 맞은편에 앉은 왕토니가 눈썹을 치켜올리더니 나직이 물었다.\n“서 주방장, 식당 일은 원래 고생해서 버는 돈이잖아요. 그런데 이건 전쟁으로 버는 돈이네요. 전쟁이 아니었다면 이렇게 많이 벌 수 있었겠어요?”\n\n서복의 손이 아주 잠깐 멈췄다. 입가에는 뜻을 이뤘다는 듯한 뿌듯하고 흡족한 웃음이 번졌다. 그가 막 대답하려던 순간, 갑작스러운 소란이 방 안의 분위기를 깨뜨렸다.",
    "고집 센 어린 사이프가 호기심에 왕토니가 옆에 내려놓은 총을 몰래 만진 것이었다. 왕토니는 순식간에 격분해 총을 거칠게 빼앗고 사이프를 날카롭게 꾸짖었다. 두 사람의 격렬한 언쟁이 복도에 울려 퍼졌다.",
    "마준생이 급히 일어나 말리며 사이프를 자기 뒤로 감쌌다. 그는 이해할 수 없다는 듯 말했다.\n“왕토니, 애한테 그렇게까지 해야겠어요? 밥이나 편하게 먹으면 안 돼요?”\n\n“애라고요? 저건 그냥 평범한 애가 아니에요!” 왕토니는 충혈된 눈으로 사이프를 가리키며 고함쳤다. “저들은 태어날 때부터 테러리스트라고요!”\n\n그는 밥그릇을 든 채 떨리는 목소리로 두 달 동안 가슴에 묻어 둔 상처를 털어놓았다. 두 달 전, 가장 친했던 친구가 길에서 겨우 일곱 살짜리 아이의 총에 맞아 죽었다는 것이었다. 증오에 젖은 이 땅에서, 그에게 ‘아이’라는 말은 더 이상 순수함을 뜻하지 않았다. 언제든 목숨을 앗아 갈 수 있는 흉기였다."
];
  const pages=[texts[0],texts[1],...texts[2].split("\n\n")];
  window.showTonyConflict=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="tony-conflict-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","전쟁의 돈과 왕토니의 상처");
    const art=document.createElement("div");art.className="tony-conflict-art";
    const images=[1,2,3].map((number,i)=>{const img=document.createElement("img");img.src=`../js/images/tony-conflict-${number}.jpg`;img.alt=["지폐를 세는 서복","왕토니의 총을 만지는 사이프","왕토니를 말리는 마준생"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=null;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);
      const imageIndex=Math.min(index,2),incoming=images[imageIndex];
      if(current!==incoming){await incoming.decode();incoming.style.zIndex="1";await fade(incoming,0,1,850);
        images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});current=incoming;}
      scene.dataset.step=imageIndex;prose.textContent=pages[index];await fade(prose,0,1,300);busy=false;
      if(index===pages.length-1)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===pages.length-1){busy=true;window.showTonyTear(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});
    if(previous)previous.remove();show();
  };
})();
