(() => {
  "use strict";
  // 修改这里即可调整速度。展开全程使用同一张连续变形的网格。
  const TIMING = { unfold: 1850, title: 2200, small: 4250, quotes: 6300, textComplete: 8400, flatten: 9500, complete: 12300 };
  const scene = document.getElementById("scene");
  const trigger = document.getElementById("paper-trigger");
  const ball = document.getElementById("ball-photo");
  const mesh = document.getElementById("paper-mesh");
  const shadow = document.getElementById("paper-shadow");
  const poster = document.getElementById("poster");
  const title = document.getElementById("ink-title");
  const small = document.getElementById("ink-small");
  const quotes = document.getElementById("ink-quotes");
  const finalOriginal = document.getElementById("final-original");
  const flattened = document.getElementById("flattened-poster");
  const menuPanel = document.getElementById("menu-panel");
  const menuArt = document.getElementById("menu-art");
  const menuReveal = document.getElementById("menu-reveal");
  const status = document.getElementById("status");
  const replay = document.getElementById("replay");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = reduced ? 0.12 : 1;
  let renderer, paperTexture;
  let busy = false, raf = 0, start = 0;
  let menuReady = false;
  let menuAnimations = [];

  const clamp = x => Math.min(1, Math.max(0, x));
  const ease = x => { const t=clamp(x); return t*t*(3-2*t); };
  const fade = (time, at, duration) => ease((time-at)/duration);
  const loadImage = src => new Promise((resolve,reject) => {
    const image = new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src;
  });

  function createRenderer(texture, ballTexture) {
    const gl = mesh.getContext("webgl", {alpha:true, antialias:true, premultipliedAlpha:false, preserveDrawingBuffer:true});
    if (!gl) return null;
    const vertex = `
      attribute vec2 aUV;
      uniform float uTime;
      uniform float uFold;
      uniform vec2 uAxisX[17];
      uniform vec2 uAxisY[17];
      uniform float uKnotsX[17];
      uniform float uKnotsY[17];
      varying vec2 vUV;
      varying float vLight;
      varying float vOcclusion;

      vec2 alongX(float u) {
        float t=clamp(u,0.0,1.0);
        vec2 p=uAxisX[16];
        for(int i=0;i<16;i++) {
          if(t>=uKnotsX[i] && t<=uKnotsX[i+1]) p=mix(uAxisX[i],uAxisX[i+1],(t-uKnotsX[i])/(uKnotsX[i+1]-uKnotsX[i]));
        }
        return p;
      }
      vec2 alongY(float u) {
        float t=clamp(u,0.0,1.0);
        vec2 p=uAxisY[16];
        for(int i=0;i<16;i++) {
          if(t>=uKnotsY[i] && t<=uKnotsY[i+1]) p=mix(uAxisY[i],uAxisY[i+1],(t-uKnotsY[i])/(uKnotsY[i+1]-uKnotsY[i]));
        }
        return p;
      }
      vec3 surface(vec2 q) {
        float folded=clamp(uFold,0.0,1.0);
        vec2 uv=q*.5+.5;
        uv.x+=folded*.035*sin(q.y*5.1+.7)*sin(uv.x*3.14159);
        uv.y+=folded*.025*sin(q.x*6.3-1.2)*sin(uv.y*3.14159);
        vec2 x=alongX(uv.x);
        vec2 y=alongY(uv.y);
        float ridge=(abs(sin(q.x*17.0+q.y*9.0))-.63662)*.018;
        ridge+=(abs(sin(q.y*22.0-q.x*6.0))-.63662)*.012;
        float dome=.15*(1.0-q.x*q.x)*(1.0-q.y*q.y)*folded;
        // 两个方向都沿真实弧长转开；没有整张纸的缩放。
        return vec3(x.x, -y.x, x.y+y.y+dome+ridge*folded);
      }
      void main() {
        vUV=aUV;
        vec2 q=aUV*2.0-1.0;
        vec3 p=surface(q);
        // 由真实变形斜率计算法线，光影跟着折角起伏。
        vec3 dx=surface(q+vec2(.003,0.0))-p;
        vec3 dy=surface(q+vec2(0.0,.003))-p;
        dx.x*=1.40776;
        dy.x*=1.40776;
        vec3 normal=normalize(cross(dy,dx));
        if(normal.z<0.0) normal=-normal;
        float diffuse=max(0.0,dot(normal,normalize(vec3(-.42,.56,1.25))));
        float flatDiffuse=dot(vec3(0.0,0.0,1.0),normalize(vec3(-.42,.56,1.25)));
        float motion=1.0-smoothstep(.65,1.05,uTime);
        vLight=mix(1.0,.50+.50*diffuse/flatDiffuse,motion);
        float concavity=max(0.0,(dx.z+dy.z)/.006);
        vOcclusion=1.0-min(.18,concavity*.028)*motion;
        vec2 projected=p.xy/(1.0-p.z*.25);
        gl_Position=vec4(projected,-p.z*.35,1.0);
      }
    `;
    const fragment = `
      precision mediump float;
      uniform sampler2D uTexture;
      uniform sampler2D uBallTexture;
      uniform float uInkReveal;
      uniform float uRound;
      varying vec2 vUV;
      varying float vLight;
      varying float vOcclusion;
      void main() {
        float left=.018+.003*sin(vUV.y*26.0);
        float right=.978+.002*sin(vUV.y*31.0);
        float top=.022+.002*sin(vUV.x*24.0);
        float bottom=.977+.002*sin(vUV.x*27.0);
        if(vUV.x<left || vUV.x>right || vUV.y<top || vUV.y>bottom) discard;
        float oval=length((vUV-.5)*vec2(1.96,1.92));
        if(oval>mix(1.38,1.03,uRound)) discard;
        vec4 ink=texture2D(uTexture,vUV);
        vec4 crumpled=texture2D(uBallTexture,vec2(.248,.114)+vUV*vec2(.454,.724));
        vec3 paper=mix(crumpled.rgb,ink.rgb,uInkReveal);
        gl_FragColor=vec4(paper*mix(1.0,vLight*vOcclusion,uInkReveal),1.0);
      }
    `;
    function shader(type,code) {
      const s=gl.createShader(type); gl.shaderSource(s,code); gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    const program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    // 共享顶点的细密网格：折痕连续，避免一条条折页的机械感。
    const cols=112, rows=80, vertices=[], indices=[];
    for(let y=0;y<=rows;y++) for(let x=0;x<=cols;x++) vertices.push(x/cols,y/rows);
    for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
      const a=y*(cols+1)+x, b=a+1, c=a+cols+1, d=c+1;
      indices.push(a,b,c,b,d,c);
    }
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(program,"aUV"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const indexBuffer=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    const tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture);
    gl.uniform1i(gl.getUniformLocation(program,"uTexture"),0);
    const ballTex=gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,ballTex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,ballTexture);
    gl.uniform1i(gl.getUniformLocation(program,"uBallTexture"),1);
    const inkReveal=gl.getUniformLocation(program,"uInkReveal");
    const roundAmount=gl.getUniformLocation(program,"uRound");
    if(gl.getError()!==gl.NO_ERROR) throw new Error("无法上传纸张纹理");
    const clock=gl.getUniformLocation(program,"uTime");
    const axisX=gl.getUniformLocation(program,"uAxisX[0]");
    const axisY=gl.getUniformLocation(program,"uAxisY[0]");
    const foldAmount=gl.getUniformLocation(program,"uFold");
    gl.uniform1fv(gl.getUniformLocation(program,"uKnotsX[0]"),new Float32Array(PaperMotion.xKnots));
    gl.uniform1fv(gl.getUniformLocation(program,"uKnotsY[0]"),new Float32Array(PaperMotion.yKnots));
    gl.clearColor(0,0,0,0); gl.enable(gl.DEPTH_TEST);
    function resize() {
      const ratio=Math.min(devicePixelRatio || 1,1.5);
      const width=Math.max(1,Math.round(scene.clientWidth*ratio));
      const height=Math.max(1,Math.round(scene.clientHeight*ratio));
      if(mesh.width!==width || mesh.height!==height) {mesh.width=width; mesh.height=height;}
      gl.viewport(0,0,width,height);
    }
    return {
      draw(seconds) {
        resize(); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        const state=PaperMotion.sample(seconds);
        gl.uniform2fv(axisX,state.x); gl.uniform2fv(axisY,state.y);
        gl.uniform1f(foldAmount,state.fold);
        gl.uniform1f(inkReveal,ease((seconds-.06)/.40));
        gl.uniform1f(roundAmount,Math.pow(clamp(state.fold),3));
        gl.uniform1f(clock,seconds); gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
      }
    };
  }

  function prepareLayers(original, clean) {
    const w = original.naturalWidth;
    const h = original.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(original, 0, 0);
    const source = ctx.getImageData(0, 0, w, h);
    ctx.drawImage(clean, 0, 0, w, h);
    const plate = ctx.getImageData(0, 0, w, h);
    const base = new ImageData(new Uint8ClampedArray(source.data), w, h);
    const groups = [
      { canvas: title, white: false, boxes: [[.19,.035,.47,.135],[.475,.135,.794,.224]] },
      { canvas: small, white: false, boxes: [[.155,.136,.467,.223],[.52,.07,.835,.135]] },
      { canvas: quotes, white: true, boxes: [[.155,.71,.418,.855],[.646,.56,.865,.635]] },
    ];
    groups.forEach(group => {
      const mask = new Uint8Array(w * h);
      group.boxes.forEach(([x1,y1,x2,y2]) => {
        for (let y = Math.floor(y1*h); y < y2*h; y++) {
          for (let x = Math.floor(x1*w); x < x2*w; x++) {
            const i = (y*w+x)*4;
            const [r,g,b] = source.data.subarray(i,i+3);
            const ink = group.white ? (r > 140 && g > 135 && r > b*.89) : (b-r > 6 && b-g > 1 && r < 210);
            if (ink) {
              for (let dy=-2; dy<=2; dy++) for (let dx=-2; dx<=2; dx++) {
                const xx=x+dx, yy=y+dy;
                if(xx>=0 && xx<w && yy>=0 && yy<h) mask[yy*w+xx]=1;
              }
            }
          }
        }
      });
      group.canvas.width=w; group.canvas.height=h;
      const gc=group.canvas.getContext("2d");
      const layer=gc.createImageData(w,h);
      for(let p=0; p<mask.length; p++) {
        if(!mask[p]) continue;
        const i=p*4;
        for(let c=0;c<4;c++) {
          base.data[i+c]=plate.data[i+c];
          layer.data[i+c]=source.data[i+c];
        }
      }
      gc.putImageData(layer,0,0);
    });
    ctx.putImageData(base,0,0);
    document.getElementById("poster-base").width=w;
    document.getElementById("poster-base").height=h;
    document.getElementById("poster-base").getContext("2d").putImageData(base,0,0);
    return canvas;
  }


  function frame(now) {
    if(!busy) return;
    const time=(now-start)/speed;
    const progress=ease(time/TIMING.unfold);
    // 一个连续的时间轴；不存在中间图片的停留或分段加载。
    const entering=fade(time,0,190);
    const settling=fade(time,TIMING.unfold-120,220);
    ball.style.opacity=1-entering;
    const loosening=Math.exp(-time/100)*Math.sin(time/45)*.003;
    ball.style.transform=`translateY(${-loosening*12}px) scale(${1+loosening},${1-loosening})`;
    mesh.style.opacity=entering*(1-settling);
    shadow.style.opacity=entering*(1-settling)*.18;
    shadow.style.transform=`translateY(${(1-progress)*8}px) scale(${.45+.55*progress},${.65+.35*progress})`;
    shadow.style.filter=`blur(${6+9*(1-progress)}px)`;
    if(renderer && time<TIMING.unfold+150) renderer.draw(time/TIMING.unfold*1.05);
    if(!renderer) {
      // 无 WebGL 时仍然连续缩放展开，保留相同文字顺序。
      poster.style.transform=`scale(${.44+.56*progress},${.68+.32*progress})`;
      poster.style.opacity=entering;
    } else poster.style.opacity=settling;
    title.style.opacity=fade(time,TIMING.title,1700);
    small.style.opacity=fade(time,TIMING.small,1700);
    quotes.style.opacity=fade(time,TIMING.quotes,2000);
    finalOriginal.style.opacity=fade(time,TIMING.textComplete-100,100);
    // 原纸张先完整呈现，再从中心向边缘淡去褶皱、过渡到平铺原图。
    const flatProgress=fade(time,TIMING.flatten,TIMING.complete-TIMING.flatten);
    const spread=flatProgress*148-24;
    const mask=`radial-gradient(ellipse at 50% 48%, black ${spread-24}%, transparent ${spread}%)`;
    flattened.style.opacity=ease(flatProgress*5);
    flattened.style.maskImage=mask;
    flattened.style.webkitMaskImage=mask;
    if(time<TIMING.complete) raf=requestAnimationFrame(frame);
    else {
      busy=false; mesh.style.opacity=0; shadow.style.opacity=0; poster.style.opacity=1;
      poster.style.transform="none";
      poster.setAttribute("aria-hidden","true");
      flattened.removeAttribute("aria-hidden");
      flattened.style.opacity=1;
      flattened.style.maskImage="none";
      flattened.style.webkitMaskImage="none";
      scene.removeAttribute("aria-busy");
      menuReady=true; menuReveal.hidden=false;
      status.textContent="点击画面，显示右侧菜单"; replay.hidden=false;
    }
  }

  function reset() {
    cancelAnimationFrame(raf); busy=false;
    menuAnimations.forEach(animation=>animation.cancel()); menuAnimations=[];
    menuReady=false; menuReveal.hidden=true;
    document.querySelectorAll('.menu-hotspot').forEach(button=>button.disabled=true);
    scene.classList.remove("menu-visible");
    menuPanel.style.opacity=0; menuPanel.setAttribute("aria-hidden","true");
    flattened.style.transform="none";
    ball.style.opacity=1; ball.style.transform="none"; mesh.style.opacity=0; shadow.style.opacity=0; poster.style.opacity=0;
    poster.style.transform="none";
    [title,small,quotes,finalOriginal].forEach(el=>el.style.opacity=0);
    flattened.style.opacity=0;
    flattened.setAttribute("aria-hidden","true");
    flattened.style.maskImage="radial-gradient(ellipse at 50% 48%, black -48%, transparent -24%)";
    flattened.style.webkitMaskImage=flattened.style.maskImage;
    replay.hidden=true; trigger.hidden=false; trigger.disabled=false;
    poster.setAttribute("aria-hidden","true"); scene.removeAttribute("aria-busy");
    status.textContent="点击纸团，展开故事";
  }

  trigger.addEventListener("click",()=>{
    if(busy || trigger.disabled) return;
    busy=true; trigger.disabled=true; scene.setAttribute("aria-busy","true");
    status.textContent=""; start=performance.now(); raf=requestAnimationFrame(frame);
  });
  menuReveal.addEventListener("click",()=>{
    if(!menuReady || busy) return;
    menuReady=false;
    menuReveal.hidden=true;
    status.textContent="";
    flattened.removeAttribute("aria-hidden");
    menuPanel.removeAttribute("aria-hidden");
    scene.classList.add("menu-visible");
    document.querySelectorAll('.menu-hotspot').forEach(button=>button.disabled=false);
    const duration=reduced ? 100 : 750;
    menuAnimations.push(menuPanel.animate([
      {opacity:0,transform:"translateX(8px)"},
      {opacity:1,transform:"translateX(0)"},
    ],{duration,easing:"cubic-bezier(.22,.61,.36,1)",fill:"forwards"}));
  });
  replay.addEventListener("click",()=>{ reset(); trigger.focus(); });
  new ResizeObserver(()=>{ if(renderer && !busy) renderer.draw(1.05); }).observe(scene);
  document.addEventListener("visibilitychange",()=>{
    // 切换窗口后沿原时间轴继续，不累积多个动画或计时器。
    if(!document.hidden && busy) {cancelAnimationFrame(raf); raf=requestAnimationFrame(frame);}
  });
  Promise.all([loadImage(PAPER_ASSETS.original),loadImage(PAPER_ASSETS.flatClean),loadImage(PAPER_ASSETS.ball),loadImage(flattened.src),loadImage(menuArt.src)])
    .then(([original,clean,ballTexture])=>{
      finalOriginal.src=original.src;
      paperTexture=prepareLayers(original,clean);
      try { renderer=createRenderer(paperTexture,ballTexture); }
      catch(error) { console.warn("使用兼容展开模式",error); renderer=null; }
      reset();
    }).catch(error=>{
      console.error(error); status.textContent="图片加载失败，请检查 js 文件夹是否完整后刷新。";
    });
})();
