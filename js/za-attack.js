(() => {
  "use strict";
  const steps=[
    [0,""],
    [1,"집 안에서는 아내가 자이드를 매섭게 나무라고 있었다. 집에는 아직 전기가 들어오지 않는데, 그가 이끄는 용식당에는 진작 전기가 들어왔고 밤에는 환하게 불을 밝힌 술집까지 열고 있었다. 아내는 더 이상 정전 속에서 제대로 살 수 없다면 딸을 데리고 친정으로 가겠다고 울먹였다."],
    [1,"그러나 자이드가 아내에게 설명할 틈도 없이, 운명처럼 재앙이 덮쳐 왔다."],
    [2,"쾅!!"],
    [3,""],
    [4,"자이드가 앞서 미군과의 고가 의약품 거래를 일방적으로 끊은 뒤, 보복은 빠르고 잔혹하게 찾아왔다. 깊은 밤, 그의 집에 치명적인 공격이 가해졌다. 거센 불길이 순식간에 집 전체를 삼켰다. 사나운 불빛이 밤하늘을 뒤흔들었고, 집 안에서는 절망에 찬 비명과 총성이 들려왔다."],
    [4,"소식을 듣고 서복과 마준생이 달려왔을 때, 한때 따뜻했던 집은 이미 폐허와 검게 탄 잔해로 변해 있었다. 두 사람은 무너진 담과 벽 사이를 다급히 뒤져, 마침내 숨이 끊어질 듯한 자이드를 찾아냈다. 그의 아내와 딸은 모두 이 참화 속에서 사라지고 말았다."]
  ];
  window.showZaAttack=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="za-attack-scene";scene.lang="ko";scene.tabIndex=-1;scene.setAttribute("aria-label","자이드의 집에 닥친 습격");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,id="za-fire-"+Math.random().toString(36).slice(2);
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.classList.add("za-attack-filters");svg.setAttribute("aria-hidden","true");
    svg.innerHTML=`<defs><filter id="${id}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".014 .04" numOctaves="2" seed="5" result="noise">${reduced?"":'<animate attributeName="baseFrequency" values=".014 .04;.020 .055;.012 .044;.014 .04" dur="2.8s" repeatCount="indefinite"/>'}</feTurbulence><feOffset in="noise" result="rise">${reduced?"":'<animate attributeName="dy" values="26;-26" dur="1.8s" repeatCount="indefinite"/>'}</feOffset><feDisplacementMap in="SourceGraphic" in2="rise" scale="${reduced?0:24}" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
    const art=document.createElement("div");art.className="za-attack-art";
    const images=[],layers=[],flames=[];
    for(let i=0;i<5;i++){
      const layer=document.createElement("div");layer.className="za-attack-layer";
      const img=new Image();img.src=`../js/images/za-attack-${i+1}.jpg`;img.draggable=false;img.alt=["자이드의 집이 있는 조용한 거리","정전된 집 안에서 다투는 자이드 부부","폭발에 몸을 웅크린 서복","불길에 휩싸인 집 안","불타는 집 앞에서 자이드를 발견한 서복"][i];layer.append(img);
      if(i>=3){const flame=img.cloneNode();flame.alt="";flame.setAttribute("aria-hidden","true");flame.className="za-painted-fire";flame.style.filter=`url(#${id})`;layer.append(flame);flames[i]=flame;}
      images.push(img);layers.push(layer);art.append(layer);
    }
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(svg,art,prose);
    let index=0,busy=true,current=-1;
    const regions={3:[[.50,.06,1,.20],[.31,.38,.18,.70],[.59,.47,.24,.96],[.91,.28,.14,.60],[.06,.85,.20,.35]],4:[[.16,.30,.29,.55],[.27,.44,.20,.42],[.83,.40,.22,.55],[.49,.09,.44,.20]]};
    function resize(){
      for(const key of [3,4]){
        const img=images[key];if(!img.naturalWidth)continue;
        const width=scene.clientWidth,height=scene.clientHeight,scale=Math.max(width/img.naturalWidth,height/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
        const mask=regions[key].map(([x,y,rw,rh])=>`radial-gradient(ellipse ${rw*w/2}px ${rh*h/2}px at ${x*w+(width-w)/2}px ${y*h+(height-h)/2}px,#000 55%,transparent 100%)`).join(",");flames[key].style.maskImage=mask;flames[key].style.webkitMaskImage=mask;
      }
    }
    images.forEach(img=>img.addEventListener("load",resize));
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);const [imageIndex,text]=steps[index];
      if(current!==imageIndex){await images[imageIndex].decode();resize();const layer=layers[imageIndex];layer.style.zIndex="1";await fade(layer,0,1,imageIndex===2?180:800);layers.forEach(el=>{el.style.opacity=el===layer?"1":"0";el.style.zIndex="0";});current=imageIndex;}
      scene.dataset.image=imageIndex;scene.dataset.step=index;prose.textContent=text;prose.hidden=!text;await fade(prose,0,1,280);
      if(imageIndex===2&&!reduced){await art.animate([
        {transform:"scale(1.025) translate(0,0)"},{transform:"scale(1.025) translate(-5px,3px)"},{transform:"scale(1.025) translate(7px,-4px)"},{transform:"scale(1.025) translate(-6px,4px)"},{transform:"scale(1.025) translate(4px,-2px)"},{transform:"scale(1.025) translate(-2px,1px)"},{transform:"scale(1.025) translate(0,0)"}
      ],{duration:1100,iterations:2,easing:"linear"}).finished;}
      busy=false;if(index===steps.length-1)scene.classList.add("is-complete");
    }
    function advance(){if(busy)return;if(index===steps.length-1){busy=true;window.showZaFarewell(scene);return;}index++;show();}
    scene.addEventListener("click",advance);scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    const observer=new ResizeObserver(()=>{if(!scene.isConnected){observer.disconnect();return;}resize();});observer.observe(scene);show();
  };
})();
