(() => {
  "use strict";
  const pages = [
    "2005년 4월",
    "그들은 디얄라주의 알리 교도소에 갇혔다. 원래 이전 정권의 시설이었지만, 미군이 점령한 뒤 이 지역 최대의 군사 교도소로 바뀐 곳이었다. 주황색 죄수복을 입는 순간, 끝없는 기다림과 불확실함이 그들을 집어삼켰다. 돈을 조금이라도 더 벌려고 귀국을 거듭 미뤘던 서복은 이제 철창 안에서 오직 집으로 돌아가고 싶다는 간절한 바람만 품었다. 살아서 돌아갈 수만 있다면…… 기약 없는 조사가 끝나기 전까지 그들이 할 수 있는 일은 차가운 철창 뒤에서 참고 기다리는 것뿐이었다.",
    "반년 후",
    "미군 부대의 주방에는 수증기와 기름 연기가 자욱했다.",
    "수감 중인 서복은 이곳에서 중국 요리를 만드는 일을 맡았다. 쭤쭝탕 치킨, 게다리 튀김, 리훙장 잡채와 산라탕, 미군의 입맛에 맞게 바꾼 ‘서복 버거’까지, 중국의 맛을 담은 음식이 끊임없이 식탁에 올랐다. 서복은 기회를 틈타 미군 장교에게 고국에 있는 가족과 전화 한 통만 하게 해 달라고 간청했다. 그러나 장교는 성가시다는 듯 손을 내저으며 조급해하지 말라고 했다. ‘아직 사건을 조사 중’이라는 말로 그의 부탁을 냉정하게 거절했다."
  ];
  const pictureForStep = [0,0,1,1,2];
  window.showPrisonKitchen = async (previous = null) => {
    const scene = document.createElement("section");
    scene.className="prison-kitchen-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","교도소와 미군 부대의 주방");
    const art=document.createElement("div");art.className="prison-kitchen-art";
    const images=[1,2,3].map((number,i)=>{
      const img=document.createElement("img");img.src=`../js/images/prison-kitchen-${number}.jpg`;
      img.alt=["주황색 죄수복을 입은 수감자들이 있는 교도소","미군 부대의 성조기","미군 장교에게 음식을 차리는 서복"][i];
      img.draggable=false;art.append(img);return img;
    });
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=-1;
    async function fade(el,from,to,duration){
      const a=el.animate([{opacity:from},{opacity:to}],{duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"});
      await a.finished;el.style.opacity=String(to);a.cancel();
    }
    async function show(){
      busy=true;await fade(prose,1,0,160);
      const next=pictureForStep[index];
      if(current!==next){
        await images[next].decode();images[next].style.zIndex="1";await fade(images[next],0,1,850);
        images.forEach((img,i)=>{img.style.opacity=i===next?"1":"0";img.style.zIndex="0";});current=next;
      }
      scene.dataset.step=String(index);prose.textContent=pages[index];await fade(prose,0,1,350);busy=false;
    }
    function advance(){if(busy)return;if(index===pages.length-1){busy=true;window.showPrisonChili(scene);return;}index++;show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();
  };
})();
