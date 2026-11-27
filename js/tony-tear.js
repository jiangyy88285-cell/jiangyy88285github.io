(() => {
  "use strict";
  const texts=[
    "서복은 잠시 말없이 듣고 있다가 다툼을 가라앉혔다. 부드럽지만 단호한 눈빛으로 주방을 가리키며 말했다.\n\n“하지만 여기 음식은 모두 이 아이들이 도와서 만든 거예요. 저는 이 아이들이 훌륭한 요리사가 될 거라고 생각해요. 세상일이 그렇게 절대적인 것만은 아니잖아요. 밥 잘 먹는 게 무엇보다 중요하죠.”",
    "서복의 차분하고 확신에 찬 모습을 보며, 왕토니가 오랫동안 억눌러 온 마음의 방어벽이 끝내 무너졌다. 그는 탁자에 엎드려 소리 내어 울었다. 길을 잃은 아이처럼 흐느끼며 말했다.\n\n“집에 가고 싶어요…… 정말 집에 가고 싶어요……”",
    "포연은 아직 가시지 않았고, 술 향은 아련하게 감돌았다. 타향을 떠도는 두 평범한 사람은 차가운 현실과 희미한 온기 사이에서, 고향을 그리는 아픔이 밤 속으로 말없이 번져 가도록 내버려 두었다."
  ];
  window.showTonyTear=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="tony-tear-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","집에 가고 싶은 왕토니");
    const image=document.createElement("img");image.src="../js/images/tony-tear.png";image.alt="고개를 숙인 왕토니";image.draggable=false;
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(image,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){busy=true;await fade(prose,1,0,140);prose.textContent=texts[index];await fade(prose,0,1,300);busy=false;if(index===texts.length-1)scene.classList.add("is-complete");}
    function advance(){if(busy)return;if(index===texts.length-1){busy=true;window.showFamilyVideoCall(scene);return;}index++;show();}
    scene.addEventListener("click",advance);scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await image.decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    await fade(image,0,1,850);show();
  };
})();
