(() => {
  "use strict";
  const texts = [
    "그때 문밖은 이미 아수라장이 되어 있었다. 전쟁은 질서를 무너뜨렸고, 사람들은 먹을 것이 없었다. 거리에는 살인과 방화, 약탈의 참혹한 광경이 가득했다.",
    "그때 문밖은 이미 아수라장이 되어 있었다. 전쟁은 질서를 무너뜨렸고, 사람들은 먹을 것이 없었다. 거리에는 살인과 방화, 약탈의 참혹한 광경이 가득했다.",
    "그러나 이 폐허 속에서도 용식당은 기적처럼 귀한 평화와 안온함을 지키고 있었다. 그 배경에는 현지 수도·전력국장이기도 한 암시장 상인 자드가 있었다. 그는 식당의 생존에 가장 기본적인 물과 전기의 공급을 확고하게 쥐고 있었다."
  ];
  // Local regions cover the flames already painted in each illustration.
  const regions = [
    [[.075,.43,.20,.48],[.19,.43,.20,.43],[.34,.77,.12,.25]],
    [[.40,.35,.29,.37],[.48,.67,.27,.22],[.77,.34,.30,.56],[.94,.64,.13,.28],[.12,.65,.09,.15]],
    [[.10,.38,.27,.54],[.33,.47,.33,.58],[.57,.42,.36,.68],[.78,.51,.33,.57],[.27,.10,.58,.42],[.74,.12,.54,.46]]
  ];
  window.showStreetFire = async (previous = null, startAt = 0) => {
    const scene=document.createElement("section");scene.className="street-fire-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","전쟁의 거리와 용식당");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const filterId="painted-fire-"+Math.random().toString(36).slice(2);
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("class","street-fire-filters");svg.setAttribute("aria-hidden","true");
    svg.innerHTML=`<defs><filter id="${filterId}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".013 .035" numOctaves="2" seed="8" result="noise">${reduced?"":'<animate attributeName="baseFrequency" values=".013 .035;.019 .049;.011 .041;.013 .035" dur="2.9s" repeatCount="indefinite"/>'}</feTurbulence><feOffset in="noise" result="risingNoise">${reduced?"":'<animate attributeName="dy" values="32;-32" dur="1.6s" repeatCount="indefinite"/>'}</feOffset><feDisplacementMap in="SourceGraphic" in2="risingNoise" scale="${reduced?0:26}" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
    const largerFire=svg.querySelector("filter").cloneNode(true);
    largerFire.id=filterId+"-large";
    largerFire.querySelector("feDisplacementMap").setAttribute("scale",reduced?"0":"40");
    svg.querySelector("defs").append(largerFire);
    const art=document.createElement("div");art.className="street-fire-art";
    const images=[],layers=[],flames=[];
    texts.forEach((_,i)=>{
      const layer=document.createElement("div");layer.className="street-fire-layer";
      const img=document.createElement("img");img.src=`../js/images/street-fire-${i+1}.jpg`;
      img.alt=["불타는 차량과 폐허가 된 거리","불길과 약탈로 혼란에 빠진 거리","불 위에서 요리하는 용식당의 웍"][i];img.draggable=false;
      const flame=img.cloneNode();flame.alt="";flame.setAttribute("aria-hidden","true");flame.className="painted-flames";flame.style.filter=`url(#${filterId}${i===2?"-large":""})`;
      layer.append(img,flame);art.append(layer);images.push(img);layers.push(layer);flames.push(flame);
    });
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");scene.append(svg,art,prose);
    let index=startAt===2?2:0,busy=true,phase="fire";
    await images[0].decode();
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    function resize(){
      const width=scene.clientWidth,height=scene.clientHeight;
      images.forEach((image,i)=>{
        if(!image.naturalWidth)return;
        const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
        const mask=regions[i].map(([x,y,rw,rh])=>`radial-gradient(ellipse ${rw*w/2}px ${rh*h/2}px at ${x*w+(width-w)/2}px ${y*h+(height-h)/2}px,#000 0%,#000 62%,transparent 100%)`).join(",");
        flames[i].style.maskImage=mask;flames[i].style.webkitMaskImage=mask;
      });
    }
    images.forEach(image=>image.addEventListener("load",resize));
    const observer=new ResizeObserver(resize);observer.observe(scene);resize();
    async function fade(el,a,b,d){const animation=el.animate([{opacity:a},{opacity:b}],{duration:reduced?0:d,easing:"ease-in-out",fill:"forwards"});await animation.finished;el.style.opacity=String(b);animation.cancel();}
    async function show(){
      busy=true;await fade(prose,1,0,140);await images[index].decode();resize();
      const incoming=layers[index];incoming.style.zIndex="1";await fade(incoming,0,1,800);
      layers.forEach(layer=>{layer.style.opacity=layer===incoming?"1":"0";layer.style.zIndex="0";});
      scene.dataset.step=index;prose.textContent=texts[index];await fade(prose,0,1,280);busy=false;
      if(index===2)scene.classList.add("is-complete");
    }
    async function burnThrough(){
      busy=true;scene.classList.add("is-burning");
      await fade(prose,1,0,300);
      const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
      canvas.className="street-fire-burn";canvas.setAttribute("aria-hidden","true");
      const w=Math.max(1,scene.clientWidth),h=Math.max(1,scene.clientHeight),dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
      const mw=400,mh=Math.max(1,Math.round(mw*h/w));
      const mask=document.createElement("canvas"),edge=document.createElement("canvas"),paper=document.createElement("canvas");
      mask.width=edge.width=mw;mask.height=edge.height=mh;paper.width=canvas.width;paper.height=canvas.height;
      const maskCtx=mask.getContext("2d"),edgeCtx=edge.getContext("2d"),paperCtx=paper.getContext("2d");
      const maskPixels=maskCtx.createImageData(mw,mh),edgePixels=edgeCtx.createImageData(mw,mh),field=new Float32Array(mw*mh);
      const seeds=[[.18,.18],[.45,.10],[.70,.15],[.35,.49],[.76,.52]];
      let max=0;
      for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
        const u=x/mw,v=y/mh;
        const distance=Math.min(...seeds.map(([sx,sy])=>Math.hypot((u-sx)*w/h,v-sy)));
        const noise=.019*Math.sin(x*.13+y*.09)+.012*Math.sin(x*.31-y*.21)+.006*Math.cos(x*.71+y*.47);
        const value=Math.max(.015,distance+noise);field[y*mw+x]=value;max=Math.max(max,value);
      }
      for(let i=0;i<field.length;i++)field[i]=.04+field[i]/max*.90;
      function cover(context,image,width,height){const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;context.drawImage(image,(width-iw)/2,(height-ih)/2,iw,ih);}
      function frame(progress,time){
        for(let i=0;i<field.length;i++){
          const flickerWave=.018*Math.sin((i%mw)*.19+time*.006)+.012*Math.sin(Math.floor(i/mw)*.23-time*.008);
          const delta=field[i]-progress+flickerWave,offset=i*4;
          maskPixels.data[offset+3]=Math.round(Math.max(0,Math.min(1,(.008-delta)/.016))*255);
          const rim=Math.max(0,1-Math.abs(delta)/.055),flicker=.78+.22*Math.sin(time*.012+i*.09);
          edgePixels.data[offset]=190+Math.round(rim*57);edgePixels.data[offset+1]=218+Math.round(rim*34);edgePixels.data[offset+2]=255;
          edgePixels.data[offset+3]=Math.round(rim*255*flicker*Math.min(1,(1-progress)/.06));
        }
        maskCtx.putImageData(maskPixels,0,0);edgeCtx.putImageData(edgePixels,0,0);
        paperCtx.globalCompositeOperation="source-over";paperCtx.clearRect(0,0,paper.width,paper.height);cover(paperCtx,images[2],paper.width,paper.height);
        paperCtx.globalCompositeOperation="destination-out";paperCtx.drawImage(mask,0,0,paper.width,paper.height);
        ctx.clearRect(0,0,w,h);ctx.fillStyle="#183b65";ctx.fillRect(0,0,w,h);ctx.drawImage(paper,0,0,w,h);
        ctx.save();ctx.shadowColor="#9ccaff";ctx.shadowBlur=28;ctx.drawImage(edge,0,0,w,h);ctx.restore();
      }
      frame(0,0);scene.append(canvas);art.style.visibility="hidden";
      await new Promise(resolve=>{
        const start=performance.now(),duration=reduced?0:4800;
        function tick(now){const progress=duration?Math.min(1,(now-start)/duration):1;frame(progress,now);if(progress<1)requestAnimationFrame(tick);else resolve();}
        requestAnimationFrame(tick);
      });
      observer.disconnect();scene.classList.add("is-foreboding");
      canvas.remove();art.remove();svg.remove();
      scene.classList.remove("is-burning");
      prose.className="street-fire-foreboding";
      prose.textContent="하지만 연약한 평온은 끝내 오래가지 못했다.";
      scene.setAttribute("aria-label","오래가지 못한 평온");
      phase="foreboding";
      await fade(prose,0,0,850);
      await fade(prose,0,1,2200);busy=false;
    }
    function advance(){
      if(busy)return;
      if(phase==="foreboding"){busy=true;window.showMedicineThreat(scene);return;}
      if(index===2){burnThrough();return;}index++;show();
    }
    scene.addEventListener("click",advance);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();advance();}});
    show();
  };
  window.showMedicineThreat = async (previous = null) => {
    const scene=document.createElement("section");scene.className="medicine-threat-scene";scene.lang="ko";scene.tabIndex=-1;
    scene.setAttribute("aria-label","약값과 위협");
    const image=document.createElement("img");image.src="../js/images/medicine-threat.jpg";image.alt="사무실에서 마주 앉아 이야기를 나누는 두 사람";image.draggable=false;
    const prose=document.createElement("p");prose.setAttribute("aria-live","polite");
    prose.textContent="자이드의 딸은 오래전부터 암을 앓고 있었다. 하지만 미군이 공급하는 필수 의약품의 가격은 갈수록 치솟았다. 터무니없는 금액에 자이드는 결국 더 이상 그들의 약을 사지 않기로 했다. 바로 그 일로 자이드와 식당은 조용히 그들의 적의와 위협을 받게 되었다.";
    scene.append(image,prose);await image.decode();document.body.append(scene);scene.focus({preventScroll:true});
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    await scene.animate([{opacity:0},{opacity:1}],{duration:reduced?0:850,easing:"ease-in-out"}).finished;
    if(previous)previous.remove();
    let leaving=false;
    function next(){if(leaving)return;leaving=true;window.showOfficersVisit(scene);}
    scene.addEventListener("click",next);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();next();}});
  };
})();
