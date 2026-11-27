(() => {
  "use strict";
  window.showTruckDeparture=async(previous=null)=>{
    const scene=document.createElement("section");scene.className="truck-departure-scene";scene.tabIndex=-1;
    scene.setAttribute("aria-label","짐을 실은 트럭이 멀리 떠나는 길");
    const canvas=document.createElement("canvas");canvas.setAttribute("role","img");canvas.setAttribute("aria-label","가까이 보이던 트럭이 도로를 따라 멀어지고, 넓은 풍경이 펼쳐진다");scene.append(canvas);
    const images=["close","road"].map(name=>{const img=new Image();img.src=`../js/images/truck-${name}.jpg`;return img;});
    await Promise.all(images.map(img=>img.decode()));
    const road=images[1],rw=road.naturalWidth,rh=road.naturalHeight;
    // Rebuild just the pale roadway beneath the moving vehicle from the road above it.
    const background=document.createElement("canvas");background.width=rw;background.height=rh;
    const bg=background.getContext("2d");bg.drawImage(road,0,0);
    // Replace the original stationary truck and its complete cast shadow.
    // Restore the left verge from the clear opposite verge, then restore the road.
    bg.save();bg.beginPath();
    [[.31,.57],[.454,.57],[.465,.91],[.37,.91]].forEach(([x,y],i)=>{if(i===0)bg.moveTo(x*rw,y*rh);else bg.lineTo(x*rw,y*rh);});
    bg.closePath();bg.clip();
    bg.translate(rw,0);bg.scale(-1,1);bg.drawImage(road,0,0);bg.restore();
    bg.save();bg.beginPath();
    [[.454,.44],[.550,.44],[.614,1],[.391,1]].forEach(([x,y],i)=>{if(i===0)bg.moveTo(x*rw,y*rh);else bg.lineTo(x*rw,y*rh);});
    bg.closePath();bg.clip();
    bg.drawImage(road,rw*.48,rh*.20,rw*.025,rh*.18,rw*.38,rh*.44,rw*.25,rh*.56);
    bg.restore();
    const sprite=document.createElement("canvas");sprite.width=rw*.155;sprite.height=rh*.37;
    const sp=sprite.getContext("2d");
    // Keep only the truck silhouette; do not carry a soft patch of road with it.
    const outline=[[.455,.484],[.540,.484],[.551,.548],[.552,.734],[.548,.744],[.548,.766],[.536,.766],[.533,.747],[.462,.747],[.460,.766],[.449,.766],[.447,.739],[.447,.548]];
    sp.beginPath();
    outline.forEach(([x,y],i)=>{const px=(x-.414)*rw,py=(y-.478)*rh;if(i===0)sp.moveTo(px,py);else sp.lineTo(px,py);});
    sp.closePath();sp.clip();
    sp.drawImage(road,rw*.414,rh*.478,sprite.width,sprite.height,0,0,sprite.width,sprite.height);
    const ctx=canvas.getContext("2d"),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width,height,last=0,start=null;
    function resize(){width=scene.clientWidth;height=scene.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(last);}
    function cover(image,zoom=1,anchor=.5){const scale=Math.max(width/image.width,height/image.height)*zoom,w=image.width*scale,h=image.height*scale;ctx.drawImage(image,(width-w)/2,height*anchor-h*anchor,w,h);}
    function draw(t){
      last=t;ctx.clearRect(0,0,width,height);
      const reveal=Math.max(0,Math.min(1,(t-.6)/1.4)),ease=reveal*reveal*(3-2*reveal);
      if(reveal<1)cover(images[0],1.10-Math.min(t/3,1)*.1,.55);
      if(reveal>0){
        ctx.save();ctx.globalAlpha=ease;
        const progress=Math.max(0,Math.min(1,(t-.6)/5.4)),camera=1+1.45*Math.pow(1-progress,1.6);
        const scale=Math.max(width/rw,height/rh)*camera,w=rw*scale,h=rh*scale;
        const ox=(width-w)/2,oy=height*.57-h*.57;
        ctx.drawImage(background,ox,oy,w,h);
        const travel=progress*progress*(3-2*progress),size=1-travel*.65;
        const x=.491+( .505-.491)*travel,y=.663-travel*.33;
        ctx.drawImage(sprite,ox+(x-.0775*size)*w,oy+(y-.185*size)*h,.155*w*size,.37*h*size);
        ctx.restore();
      }
    }
    const prose=document.createElement("p");prose.className="truck-departure-prose";prose.lang="ko";prose.hidden=true;prose.setAttribute("aria-live","polite");
    prose.textContent="서복은 자이드에게서 술을 사기 위한 통행증을 무사히 받아 냈다. 자이드에게는 아픈 딸이 있었고, 당장 목돈이 필요했다. 그는 고민 끝에 고개를 끄덕였다. 그렇게 구하기 힘든 술이 상자째 끊임없이 용식당으로 몰래 들어오기 시작했다.";
    scene.append(prose);
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    const observer=new ResizeObserver(resize);observer.observe(scene);resize();
    function tick(now){if(!scene.isConnected){observer.disconnect();return;}if(start===null)start=now;const t=reduced?6:(now-start)/1000;draw(Math.min(6,t));if(t<6)requestAnimationFrame(tick);else {
      scene.classList.add("is-complete");prose.hidden=false;prose.style.opacity="1";
    }}
    requestAnimationFrame(tick);
    let leaving=false;
    function next(){if(!scene.classList.contains("is-complete")||leaving)return;leaving=true;observer.disconnect();window.showProsperityChoice(scene);}
    scene.addEventListener("click",next);
    scene.addEventListener("keydown",event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="Enter"||event.code==="Space"){event.preventDefault();next();}});
  };
})();
