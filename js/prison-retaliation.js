(() => {
  "use strict";
  const texts=[
    "얼마 뒤 어느 날, 그 미군 장교가 혼자 주방으로 들어왔다.",
    "그는 경비병을 돌려보내고, 주방을 정리하던 서복에게 굳은 얼굴로 다가갔다.",
    "장교는 차갑게 추궁하기 시작했다. “시치미 떼지 마. 이 감옥에서 고추가 있는 곳은 여기뿐이야. 네가 다른 놈에게 준 거지? 말하지 않으면 네가 한 짓으로 알겠다!”\n\n터무니없는 혐의에 서복은 당황한 얼굴로 거듭 해명했다.",
    "격분한 미군 장교는 이성을 잃고 손에 들고 있던 밥그릇을 세차게 내리쳐 깨뜨렸다! 바닥에 흩어진 음식을 본 서복은 다급한 마음에 불쑥 외쳤다. “음식을 낭비하면 안 됩니다!”"
  ];
  function readRetaliation(){
    if(window.storyDecisions?.chiliRetaliation)return window.storyDecisions.chiliRetaliation;
    try{return JSON.parse(sessionStorage.getItem("storyDecisions")||"{}").chiliRetaliation;}catch{return null;}
  }
  // The next shared chapter will be attached here when its content is supplied.
  window.continueAfterPrisonRetaliation=previous=>{
    if(typeof window.showPrisonNextChapter==="function")return window.showPrisonNextChapter(previous);
    return false;
  };
  function path(ctx,points,w,h){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));ctx.closePath();}
  function buildLimpCanvas(image){
    const w=1280,h=Math.round(w*image.naturalHeight/image.naturalWidth);
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    canvas.setAttribute("role","img");canvas.setAttribute("aria-label","다리를 절며 복도를 걸어가는 미군 장교");
    const ctx=canvas.getContext("2d");
    const original=document.createElement("canvas");original.width=w;original.height=h;original.getContext("2d").drawImage(image,0,0,w,h);
    const outline=[[.327,0],[.615,0],[.646,.125],[.666,.19],[.688,.28],[.695,.38],[.678,.5],[.65,.58],[.67,.72],[.675,1],[.535,1],[.527,.87],[.513,.68],[.486,.44],[.468,.62],[.46,.8],[.447,.91],[.455,1],[.39,1],[.387,.91],[.375,.8],[.377,.62],[.385,.45],[.373,.41],[.35,.445],[.324,.425],[.303,.39],[.296,.33],[.309,.26],[.303,.2],[.319,.12]];
    const figure=document.createElement("canvas");figure.width=w;figure.height=h;
    const fc=figure.getContext("2d");path(fc,outline,w,h);fc.clip();fc.drawImage(original,0,0);
    const background=document.createElement("canvas");background.width=w;background.height=h;
    const bc=background.getContext("2d");bc.drawImage(original,0,0);
    const mask=document.createElement("canvas");mask.width=w;mask.height=h;
    const mc=mask.getContext("2d");path(mc,outline,w,h);mc.fillStyle="#fff";mc.strokeStyle="#fff";mc.lineWidth=42;mc.lineJoin="round";mc.fill();mc.stroke();
    const patch=document.createElement("canvas");patch.width=w;patch.height=h;
    const pc=patch.getContext("2d");
    // Restore only the figure's old footprint using the empty corridor's paper texture.
    pc.drawImage(original,.76*w,.43*h,.09*w,.48*h,0,0,w,h);
    pc.globalCompositeOperation="destination-in";pc.drawImage(mask,0,0);bc.drawImage(patch,0,0);
    const parts={
      leftThigh:[[.36,.3],[.51,.3],[.505,.58],[.47,.84],[.37,.84],[.36,.65]],
      leftShin:[[.37,.77],[.47,.77],[.47,1],[.365,1]],
      rightThigh:[[.49,.3],[.66,.3],[.69,.70],[.535,.73],[.50,.60]],
      rightShin:[[.535,.63],[.68,.63],[.72,1],[.51,1]],
      upper:[[.28,0],[.71,0],[.73,.57],[.58,.61],[.5,.46],[.43,.6],[.28,.49]]
    };
    function drawPart(points){
      ctx.save();path(ctx,points,w,h);ctx.clip();ctx.drawImage(figure,0,0);ctx.restore();
    }
    function depthJoint(pivot,length){
      ctx.translate(pivot[0]*w,pivot[1]*h);ctx.scale(1,length);ctx.translate(-pivot[0]*w,-pivot[1]*h);
    }
    function drawLeg(thigh,shin,hip,knee,stride,kneeLift){
      ctx.save();depthJoint(hip,stride);drawPart(thigh);depthJoint(knee,kneeLift);drawPart(shin);ctx.restore();
    }
    function render(progress){
      ctx.clearRect(0,0,w,h);ctx.drawImage(background,0,0);
      const gaitPhase=progress<.62?(progress/.62)*Math.PI:Math.PI+((progress-.62)/.38)*Math.PI;
      const cycle=gaitPhase,step=Math.sin(cycle),trailing=Math.sin(cycle+Math.PI);
      const weightDrop=Math.max(0,step)*.008,scale=1+progress*.075;
      // Travel along the corridor's depth axis; no sideways translation or leg rotation.
      ctx.save();ctx.translate(w*.5,h*(.5+progress*.025+weightDrop));ctx.scale(scale,scale);ctx.translate(-w*.5,-h*.5);
      // The advancing leg extends toward the viewer while the other knee lifts and shortens.
      // The injured right leg takes a smaller step and drags behind the left.
      drawLeg(parts.leftThigh,parts.leftShin,[.45,.34],[.425,.79],1+step*.085,1-Math.max(0,-step)*.24);
      drawLeg(parts.rightThigh,parts.rightShin,[.565,.34],[.60,.65],1+trailing*.045,1-Math.max(0,-trailing)*.13);
      drawPart(parts.upper);ctx.restore();
    }
    render(0);return {canvas,render};
  }
  window.showPrisonRetaliation=async(previous=null,{preview=false}={})=>{
    if(!preview&&readRetaliation()!=="go")return window.continueAfterPrisonRetaliation(previous);
    const scene=document.createElement("section");scene.className="prison-retaliation-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","고춧가루 사건 뒤의 추궁");
    const art=document.createElement("div");art.className="prison-retaliation-art";
    const images=[1,2,3,4].map((n,i)=>{const img=document.createElement("img");img.src=`../js/images/prison-retaliation-${n}.jpg`;img.alt=["다리를 절며 주방으로 향하는 장교","서복 앞에 선 미군","주방에서 일하던 서복에게 다가오는 장교","밥그릇을 깨뜨린 장교 앞의 음식"][i];img.draggable=false;art.append(img);return img;});
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(art,prose);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,busy=true,current=null,rig=null,frame=null;
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function limp(){
      if(reduced)return;
      const start=performance.now();
      await new Promise(resolve=>{
        function tick(now){
          if(!scene.isConnected){resolve();return;}
          const progress=Math.min((now-start)/4200,1);rig.render(progress);
          if(progress<1)frame=requestAnimationFrame(tick);else{frame=null;resolve();}
        }
        frame=requestAnimationFrame(tick);
      });
    }
    async function show(){
      busy=true;await fade(prose,1,0,140);
      await images[index].decode();
      const incoming=index===0?rig.canvas:images[index];incoming.style.zIndex="1";
      await fade(incoming,0,1,700);incoming.style.zIndex="0";
      images.forEach(img=>{img.style.opacity=img===incoming?"1":"0";img.style.zIndex="0";});
      if(current&&current!==incoming)current.style.opacity="0";current=incoming;
      scene.dataset.step=String(index);prose.textContent=texts[index];await fade(prose,0,1,300);
      if(index===0)await limp();busy=false;
    }
    async function advance(){
      if(busy)return;
      if(index===texts.length-1){busy=true;await window.showPrisonKnifeIncident(scene,{preview});return;}
      index++;await show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    await images[0].decode();rig=buildLimpCanvas(images[0]);art.append(rig.canvas);
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();await show();
    return true;
  };
})();
