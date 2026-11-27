(() => {
  "use strict";
  const texts=[
    "그 말은 상대를 완전히 격분시켰다. 장교는 서복의 목을 움켜쥐고 미친 듯이 폭력을 휘둘렀다.",
    "마침 돌아온 마준생은 서복이 맞는 모습을 보자 주저 없이 달려들어 말렸다. 그러나 두 사람은 함께 무자비한 구타에 휘말렸다.",
    "마침 주방에 온 사이프는 그 광경을 보고 마음 깊은 곳의 증오가 순식간에 타올랐다. 눈이 붉게 충혈된 그는 도마 위의 날카로운 고기칼을 움켜쥐고, 포효하며 미군 장교를 향해 휘둘렀다!",
    "일촉즉발의 순간, 다행히 칼은 도마에 단단히 묶여 있었다.",
    "마준생과 서복은 울먹이며 필사적으로 말렸다. “그러지 마! 제발 칼은 안 돼!” 피투성이가 된 스승의 얼굴과 간절한 애원을 본 사이프의 손목이 심하게 떨렸다. 그는 끝내 눈물을 머금고 천천히 칼을 내렸다."
  ];
  function readChoice(){
    if(window.storyDecisions?.chiliRetaliation)return window.storyDecisions.chiliRetaliation;
    try{return JSON.parse(sessionStorage.getItem("storyDecisions")||"{}").chiliRetaliation;}catch{return null;}
  }
  function polygon(ctx,points,w,h){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));ctx.closePath();}
  function canvasFor(image){const c=document.createElement("canvas");c.width=1280;c.height=Math.round(1280*image.naturalHeight/image.naturalWidth);return c;}
  function makeChain(image){
    const c=canvasFor(image),ctx=c.getContext("2d"),w=c.width,h=c.height;
    for(const points of [ [[0,.49],[.48,.34],[.49,.63],[0,.71]], [[.53,.08],[.72,.04],[.75,1],[.51,1]] ]){
      ctx.save();polygon(ctx,points,w,h);ctx.clip();ctx.drawImage(image,0,0,w,h);ctx.restore();
    }
    c.className="prison-knife-chain";c.setAttribute("aria-hidden","true");return c;
  }
  function makeDrop(image){
    const canvas=canvasFor(image),ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
    const original=canvasFor(image);original.getContext("2d").drawImage(image,0,0,w,h);
    const blade=canvasFor(image),bc=blade.getContext("2d");
    const shape=[[.06,.55],[.14,.51],[.38,.545],[.47,.54],[.515,.535],[.55,.51],[.84,.53],[.88,.47],[.907,.52],[.936,.62],[.956,.80],[.912,.735],[.855,.732],[.789,.75],[.536,.653],[.511,.638],[.476,.65],[.326,.638],[.167,.582]];
    bc.save();polygon(bc,shape,w,h);bc.clip();bc.drawImage(original,0,0);bc.restore();
    const bg=canvasFor(image),bgc=bg.getContext("2d");bgc.drawImage(original,0,0);
    const mask=canvasFor(image),mc=mask.getContext("2d");polygon(mc,shape,w,h);mc.fillStyle="#fff";mc.strokeStyle="#fff";mc.lineWidth=34;mc.lineJoin="round";mc.fill();mc.stroke();
    const floor=canvasFor(image),fc=floor.getContext("2d");fc.drawImage(original,.11*w,.87*h,.72*w,.12*h,0,.36*h,w,.64*h);fc.globalCompositeOperation="destination-in";fc.drawImage(mask,0,0);bgc.drawImage(floor,0,0);
    canvas.setAttribute("role","img");canvas.setAttribute("aria-label","손에서 놓여 바닥으로 떨어지는 칼");
    function render(progress){
      ctx.clearRect(0,0,w,h);
      if(progress>=1){ctx.drawImage(original,0,0);return;}
      ctx.drawImage(bg,0,0);
      const fall=progress*progress;
      ctx.save();ctx.globalAlpha=.10+.13*fall;ctx.fillStyle="#183b65";ctx.beginPath();ctx.ellipse(w*.57,h*.72,w*(.14+.08*fall),h*.024,0,0,Math.PI*2);ctx.fill();ctx.restore();
      ctx.save();ctx.translate(w*(.51-.06*(1-progress)),h*(.61-.33*(1-fall)));ctx.rotate(-.30*(1-progress));ctx.translate(-w*.51,-h*.61);ctx.drawImage(blade,0,0);ctx.restore();
    }
    render(0);return {canvas,render};
  }
  window.showPrisonKnifeIncident=async(previous=null,{preview=false}={})=>{
    if(!preview&&readChoice()!=="go")return window.continueAfterPrisonRetaliation(previous);
    const scene=document.createElement("section");scene.className="prison-knife-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","주방의 폭행과 멈춰 선 칼");
    const art=document.createElement("div");art.className="prison-knife-art";
    const images=[1,2,3,4,5].map((n,i)=>{const img=document.createElement("img");img.src=`../js/images/prison-knife-${n}.jpg`;img.alt=["서복에게 폭력을 휘두르는 장교","서복을 도우려다 구타에 휘말린 마준생","칼을 든 사이프","칼을 도마에 묶어 둔 쇠사슬","바닥에 떨어지는 칼"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=null,chain=null,tremor=null,drop=null,finished=false;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    function stopChain(){if(tremor){tremor.cancel();tremor=null;}if(chain)chain.style.opacity="0";}
    async function show(){
      busy=true;stopChain();await fade(prose,1,0,140);await images[index].decode();
      if(index===4&&!drop){drop=makeDrop(images[4]);art.append(drop.canvas);}
      const incoming=index===4?drop.canvas:images[index];incoming.style.zIndex="1";await fade(incoming,0,1,750);incoming.style.zIndex="0";
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";});if(current&&current!==incoming)current.style.opacity="0";current=incoming;
      scene.dataset.step=String(index);prose.textContent=texts[index];await fade(prose,0,1,300);
      if(index===3){
        if(!chain){chain=makeChain(images[3]);art.append(chain);}chain.style.opacity="1";
        if(!reduced)tremor=chain.animate([{transform:"scale(1.02) translate(0,0)"},{transform:"scale(1.02) translate(.8px,-.5px)"},{transform:"scale(1.02) translate(-.7px,.6px)"},{transform:"scale(1.02) translate(.4px,-.4px)"},{transform:"scale(1.02) translate(0,0)"}],{duration:180,iterations:Infinity});
      }
      busy=false;
    }
    async function throwKnife(){
      busy=true;stopChain();await fade(prose,1,0,100);scene.dataset.phase="falling";
      if(reduced)drop.render(1);
      else await new Promise(resolve=>{const start=performance.now();function tick(now){if(!scene.isConnected){resolve();return;}const p=Math.min((now-start)/420,1);drop.render(p);if(p<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});
      scene.dataset.phase="landed";
      // Start the slow dissolve only after the blade has reached the floor.
      await fade(art,1,0,1800);scene.dataset.phase="complete";finished=true;
      if(preview)await window.showPrisonNextChapter(scene,"go");
      else await window.continueAfterPrisonRetaliation(scene);busy=false;
    }
    async function advance(){if(busy||finished)return;if(index===4){await throwKnife();return;}index++;await show();}
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();return true;
  };
})();
