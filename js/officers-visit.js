(() => {
  "use strict";
  const texts=[
    "얼마 뒤 어느 밤, 서복과 마준생은 주방에 앉아 술잔을 기울이고 있었다. 그때 문밖에서 둔탁하고 다급한 노크 소리가 들려왔다.\n\n“쿵! 쿵! 쿵!”\n\n두 사람은 눈빛을 주고받고, 경계하며 일어나 문을 열었다.",
    "찾아온 이들은 미군 장교들이었다. 그중 한 명은 놀랍게도 말레이시아에서 태어난 화교였다. 그들은 식당에서 식사를 하겠다고 했다. 서복은 끝내 그들의 고집을 꺾지 못하고, 어쩔 수 없이 요청을 받아들였다."
  ];
  window.showOfficersVisit=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="officers-visit-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","한밤중에 찾아온 미군 장교들");
    const art=document.createElement("div");art.className="officers-visit-art";
    const images=["outside","door"].map((name,i)=>{const img=document.createElement("img");img.src=`../js/images/officers-${name}.jpg`;img.alt=i===0?"식당 문을 두드리는 군인과 군용 차량":"문을 열자 나타난 미군 장교들";img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);await images[index].decode();
      const incoming=images[index];incoming.style.zIndex="1";await fade(incoming,0,1,850);
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});
      scene.dataset.step=index;prose.textContent=texts[index];await fade(prose,0,1,300);busy=false;
      if(index===1)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===1){busy=true;window.showOfficersMeal(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});
    if(previous)previous.remove();show();
  };
})();
