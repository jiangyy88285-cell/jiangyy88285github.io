(() => {
  "use strict";
  const texts=[
    "다음 날, 서복과 마준생은 자이드를 찾아갔다.",
    "서복은 바닥에 반쯤 무릎을 꿇었다. 충혈된 눈으로 손을 떨며 따뜻한 밥 한 그릇을 가져와, 숟가락을 자이드의 입가에 대고 나직이 권했다.\n\n“밥부터 먹어요…… 밥 잘 먹는 게 무엇보다 중요하잖아요. 제 말 듣고, 입 벌려요.”\n\n창백한 자이드는 김이 모락모락 나는 음식을 바라보았다. 그의 눈에는 끝없는 피로와 절망이 가득했다. 그는 힘겹게 입을 벌려 밥 한 숟갈을 삼켰다.",
    "그러고는 온몸에 남은 힘을 다 끌어모아, 서복과 마준생에게 쉰 목소리로 몇 마디를 뱉었다.\n\n“떠나요…… 어서 가요……”",
    "서복과 마준생은 문밖으로 떠밀려 나왔다. 그 이별은 영원한 작별이 되고 말았다. 그 뒤로 두 사람은 다시는 자이드의 모습을 보지 못했다."
];
  window.showZaFarewell=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="za-farewell-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","자이드와의 마지막 작별");
    const art=document.createElement("div");art.className="za-farewell-art";
    const images=["png","jpg","png","jpg"].map((ext,i)=>{const img=document.createElement("img");img.src=`../js/images/za-farewell-${i+1}.${ext}`;img.alt=["다음 날 찾아간 자이드","자이드에게 밥을 떠먹이는 서복","어서 떠나라고 말하는 자이드","홀로 남은 자이드의 뒷모습"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);await images[index].decode();
      const incoming=images[index];incoming.style.zIndex="1";await fade(incoming,0,1,850);
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});
      scene.dataset.step=index;prose.textContent=texts[index];await fade(prose,0,1,300);busy=false;
      if(index===3)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===3){busy=true;window.showRestaurantRaid(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});
    if(previous)previous.remove();show();
  };
})();
