(() => {
  "use strict";
  const axes = ["공감", "책임", "행동", "신중", "신뢰"];
  // Editorial story weights (1–5), not a psychological assessment.
  const choices = [
    ["restaurantStay","첫 식탁",{stay:["소신을 지키며 사장을 설득한다",[4,4,4,2,4]],leave:["식당을 떠나려 한다",[3,3,3,5,2]]}],
    ["firstHomeChoice","첫 귀향의 갈림길",{home:["가족에게 돌아갈 표를 산다",[4,4,4,5,3]],stay:["빚을 갚기 위해 남으려 한다",[2,4,3,3,2]]}],
    ["prosperityDecision","귀향과 생계",{stay:["식당에 남아 돈을 번다",[2,3,3,4,2]],home:["가족에게 돌아가려 한다",[4,4,3,5,3]]}],
    ["chiliWater","고추 물",{fake:["가짜 고추 물을 만든다",[5,4,4,4,4]],real:["진짜 고추 물을 만든다",[1,2,2,5,2]]}],
    ["chiliRetaliation","보복에 동참할 것인가",{go:["고춧가루를 뿌리러 간다",[2,2,5,1,3]],decline:["보복에 동참하지 않는다",[4,4,2,5,3]]}],
    ["grenadeChoice","발치의 수류탄",{throw:["주워서 되던진다",[4,5,5,2,3]],leave:["줍지 않는다",[2,2,1,5,2]]}],
    ["saifChallenge","사이프의 도전",{withdraw:["그만두고 돌아간다",[3,3,2,5,3]],insist:["끝까지 도전한다",[3,4,5,2,4]]}],
    ["saifTrunk","열린 짐칸",{hide:["짐칸에 숨어 따라간다",[4,3,5,1,4]],stay:["그 자리에 남는다",[3,3,2,5,3]]}],
    ["potatoConfession","감자에 대한 추궁",{admit:["자신이 넣었다고 인정한다",[5,5,4,2,4]],deny:["끝까지 부인한다",[2,2,2,5,2]]}],
    ["childrenRescue","아이들과의 탈출",{save:["아이들을 데리고 탈출한다",[5,5,5,2,5]],self:["사이프와 둘이 탈출한다",[2,3,3,5,3]]}],
    ["mouthChoice","마지막 두 마디",{open:["입을 벌린다",[3,3,3,4,5]],closed:["입을 벌리지 않는다",[3,3,4,3,1]]}]
  ];
  const endings = {
    A:{title:"돌아오지 못한 세 사람",line:"살아남기 위해 내린 선택도, 전쟁 속 안전을 보장하지는 못했다.",body:"진짜 고추 물을 만들었던 선택은 이후의 재회에서 세 사람을 구해 주지 못한다. 서복과 마준생, 사이프는 모두 돌아오지 못한다.",image:"prison-za-reunion-2.jpg"},
    B:{title:"멈춰 버린 탈출",line:"한순간의 선택 앞에, 세 사람의 시간도 멈췄다.",body:"발치에 떨어진 수류탄을 되던지지 않는다. 탈출은 그 자리에서 끝나고, 세 사람 모두 살아남지 못한다.",image:"prison-grenade-2.jpg"},
    C:{title:"침묵 뒤의 총성",line:"두려움 속에서 부인한 대답은 끝내 누구도 지켜 주지 못했다.",body:"싹 난 감자에 대한 추궁을 끝까지 부인한다. 교장의 총구는 서복과 마준생, 사이프를 향하고, 세 사람 모두 희생된다.",image:"prison-potato-confession-3.jpg"},
    D:{title:"한 그릇이 이어 준 재회",line:"이십 년 뒤, ‘서복 후이판’이라는 이름으로 기억이 돌아왔다.",body:"아이들을 데리고 국경을 넘고, 자이드의 말에 입을 벌린 서복은 살아서 귀국한다. 오랜 세월 뒤 룽 식당에서 아이들의 구조 소식을 듣고, 요리사가 된 사이프를 다시 만난다.",image:"prison-reunion-d-4.jpg"},
    E:{title:"남겨진 아이들",line:"서복과 사이프는 떠났지만, 다른 아이들은 그곳에 남았다.",body:"아이들을 데려가지 않기로 한다. 며칠 뒤 깊은 밤, 서복과 사이프는 쇠창살을 열고 함께 도망친다. 다른 아이들은 그곳에 영원히 남겨진다.",image:"prison-self-escape-e-3.jpg"},
    F:{title:"고목 아래의 마지막",line:"그와 아무 상관도 없던 전쟁이, 끝내 그의 삶을 삼켰다.",body:"아이들을 구하려 했지만, 총구 앞에서 입을 벌리지 않는다. 서복은 고목 아래 쓰러지고 아이들은 다시 끌려간다. 그는 이 전쟁에서 끝내 벗어나지 못한다.",image:"prison-mouth-choice-3.jpg"}
  };
  const esc = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function readDecisions() {
    let saved={};try {saved=JSON.parse(sessionStorage.getItem("storyDecisions")||"{}");}catch{}
    let prosperity;try {prosperity=sessionStorage.getItem("prosperityDecision");}catch{}
    return {...(saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {}),...window.storyDecisions,prosperityDecision:window.prosperityDecision||prosperity};
  }
  function profile(decisions,ending) {
    const lastKey={A:"grenadeChoice",B:"grenadeChoice",C:"potatoConfession",D:"mouthChoice",E:"childrenRescue",F:"mouthChoice"}[ending]||"mouthChoice";
    const stop=choices.findIndex(c=>c[0]===lastKey);
    const rows=choices.slice(0,stop+1).flatMap(([key,label,options])=>options[decisions[key]] ? [{key,label,value:decisions[key],text:options[decisions[key]][0],weights:options[decisions[key]][1]}] : []);
    const frames=rows.map((row,i)=>({row,scores:axes.map((_,a)=>Math.round(rows.slice(0,i+1).reduce((s,r)=>s+r.weights[a],0)/(i+1)*20))}));
    return {rows,frames,scores:frames.at(-1)?.scores||[0,0,0,0,0]};
  }
  function radar(scores) {
    const point=(i,r)=>[240+Math.sin(i*Math.PI*2/5)*r,220-Math.cos(i*Math.PI*2/5)*r];
    const points=values=>values.map((v,i)=>point(i,145*v/100).join(',')).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 440" role="img" aria-label="공감 책임 행동 신중 신뢰의 선택 경향"><title>이야기 속 선택의 다섯 방향</title>${[20,40,60,80,100].map(v=>`<polygon points="${points(Array(5).fill(v))}" fill="none" stroke="#183b65" stroke-opacity=".15"/>`).join('')}${axes.map((a,i)=>{const p=point(i,145),t=point(i,186);return `<path d="M240 220L${p.join(' ')}" stroke="#183b65" stroke-opacity=".15"/><text x="${t[0]}" y="${t[1]}" text-anchor="middle" dominant-baseline="middle" fill="#183b65" font-size="17" font-family="serif">${a}</text>`}).join('')}<polygon points="${points(scores)}" fill="#71919a" fill-opacity=".24" stroke="#386c7c" stroke-width="2.5"/>${scores.map((v,i)=>{const p=point(i,145*v/100);return `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#386c7c"/>`}).join('')}</svg>`;
  }
  window.recordStoryDecision=(key,value)=>{
    const merged=readDecisions();delete merged.prosperityDecision;
    window.storyDecisions={...merged,[key]:value};
    try{sessionStorage.setItem("storyDecisions",JSON.stringify(window.storyDecisions));}catch{}
  };
  window.storySummaryData={axes,choices,endings,profile,radar};
  window.showStoryFinale=async(previous=null,{ending=window.pendingStoryEnding?.ending,preview=false}={})=>{
    if (!endings[ending]) return false;
    const existing=document.querySelector('.story-summary'); if(existing) return true;
    const data=profile(readDecisions(),ending);
    const scene=document.createElement('section');scene.className='story-summary';scene.lang='ko';scene.tabIndex=-1;scene.dataset.ending=ending;
    scene.setAttribute('aria-label','룽 식당 · 이야기의 끝에서');
    const image=(name,alt,cls='')=>`<img class="${cls}" src="../js/images/${name}" alt="${alt}" loading="lazy">`;
    const panel=(id,title,content)=>`<section class="summary-chapter"><h2><button class="story-option summary-toggle" type="button" aria-expanded="false" aria-controls="summary-${id}" data-panel="${id}">${title}</button></h2><div class="summary-panel" id="summary-${id}" hidden>${content}</div></section>`;
    const collage=(a,b,text)=>`<div class="summary-collage">${image(a[0],a[1],'summary-photo photo-left')}<div class="summary-reading">${text}</div>${image(b[0],b[1],'summary-photo photo-right')}</div>`;
    scene.innerHTML=`<div class="summary-paper"><main class="summary-chapters">
      ${panel('people','그들은……',collage(['memory-img_3556.jpg','집을 떠나기 전의 기억'],['prison-cola-promise-1.jpg','아이들과 함께한 시간'],`<p>서복은 빚을 갚고 가족에게 돌아가려던 요리사였다. 마준생은 함께 밥을 짓던 동료였고, 사이프와 다른 아이들은 어른들의 전쟁에 휘말린 아이들이었다.</p><p>그들이 원한 것은 집으로 돌아가는 일, 따뜻한 밥 한 끼, 그리고 무사히 눈뜰 수 있는 내일뿐이었다.</p><blockquote>“네 아이들도 아니잖아.”<br>“그래도 아이들이잖아.”</blockquote>`))}
      ${panel('survivors','살아남은 그들',collage(['prison-homecoming-d-2.jpg','귀국 후 가족과의 재회'],['prison-reunion-d-4.jpg','조리대 앞의 요리사'],`<p>살아남는 것은 전쟁에서 벗어나기 위한 첫걸음이다.</p><p>재회의 결말에서 서복은 마침내 가족의 곁으로 돌아간다. 이십 년 뒤, 사이프도 요리사가 되어 그들이 함께한 기억을 지켜 간다.</p><p>한 끼의 밥과 배운 솜씨는 한때 보살핌을 받았던 이들에게 삶을 이어 갈 힘이 되었다.</p>`))}
      ${panel('waiting','아직 대피하지 못한 그들',collage(['prison-self-escape-e-1.jpg','달빛 아래 텅 빈 그네'],['prison-self-escape-e-3.jpg','멀어져 가는 차'],`<p>누군가는 떠났고, 누군가는 그곳에 남겨졌다.</p><p>또 다른 갈래에서 서복과 사이프는 함께 도망쳤지만, 아이들은 그곳에 영원히 남겨졌다. 떠난 이들의 도주는 끝났지만, 남겨진 이들의 기다림에는 아직 끝이 없다.</p><p>이야기의 시선은 함께 떠나지 못한 이들에게도 머물러야 한다.</p>`))}
      ${panel('peace','평화로 돌아온 그들',collage(['prison-homecoming-d-3.jpg','집으로 돌아온 뒤의 식탁'],['prison-reunion-d-1.jpg','메뉴에 적힌 서복 후이판'],`<p>평화는 다시 가족과 둘러앉는 일, 마음 놓고 밥을 짓는 일, 내일을 위해 더는 도망치지 않아도 되는 삶이다.</p><p>한때 국경에 심었던 선의는 ‘서복 후이판’이라는 이름 속에 남았다. 오랜 세월 뒤, 한 식당이 헤어졌던 사람들과 기억을 다시 만나게 한다.</p>`))}
      ${panel('memory','PTSD를 안고 살아가는 그들',collage(['prison-homecoming-d-4.jpg','지난날을 돌아보는 서복'],['prison-village-night-2.jpg','꿈속에서 여전히 함께인 동료들'],`<p>평화로운 일상으로 돌아왔어도 전쟁의 기억이 사라진 것은 아니었다.</p><p>서복은 가끔 같은 꿈을 꾼다. 사이프와 준생이 살아 있고, 모두 다시 룽 식당으로 돌아온 꿈이다. 이십 년이 지났어도 상실과 그리움은 여전히 꿈속으로 돌아온다.</p><p>반복되는 꿈은 살아남은 이가 쉽게 내려놓지 못하는 기억을 보여 준다.</p>`))}
      ${panel('choices','이름 너머의 육신',`<div class="summary-profile-head"><p>서복이라는 이름 너머에서, 당신도 <strong>${data.rows.length}번의 갈림길</strong>을 지나왔습니다.</p><p class="summary-note">이 그림은 이번 이야기에서 드러난 선택의 경향을 기록합니다. 성격 검사나 옳고 그름의 점수는 아닙니다.</p></div><div class="summary-profile"><div><div class="summary-radar">${radar(data.scores)}</div><button class="story-option summary-download" type="button">선택의 그림 저장하기</button></div><div class="summary-profile-copy"><h3>이번 이야기의 선택</h3><div class="summary-bars"></div><p class="summary-note">공감: 타인의 처지를 살피는 방향 · 책임: 선택의 결과를 짊어지는 방향 · 행동: 위험 속에서 움직이는 방향 · 신중: 자신과 동료의 안전을 지키는 방향 · 신뢰: 타인의 말과 관계를 믿는 방향</p></div></div><div class="summary-trail"><h3>지나온 갈림길 돌아보기</h3><p class="summary-note">각 선택을 누르면 그 순간까지의 누적 그림을 볼 수 있습니다. 겪지 않은 선택은 계산하지 않습니다.</p><button class="story-option" type="button" data-step="all">전체 선택</button>${data.rows.map((r,i)=>`<button class="story-option summary-trail-step" type="button" data-step="${i}"><span>${String(i+1).padStart(2,'0')} · ${r.label}</span><strong>${r.text}</strong></button>`).join('')}${!data.rows.length?'<p>현재 미리보기에는 선택 기록이 없습니다. 이야기의 한 갈래를 마치면 실제 기록이 표시됩니다.</p>':''}<p class="summary-note">각 방향은 완료한 선택의 서사 가중치(1–5)의 평균을 100 기준으로 환산한 값으로, 이번 이야기를 돌아보기 위한 것입니다.</p></div>`)}
      </main></div>`;
    function updateChart(step) {
      const values=step==='all'?data.scores:data.frames[Number(step)]?.scores||data.scores;
      scene.querySelector('.summary-radar').innerHTML=radar(values);
      scene.querySelector('.summary-bars').innerHTML=axes.map((a,i)=>`<div><span>${a}</span><span>${data.rows.length?values[i]:'—'}</span><b style="--score:${values[i]}%"></b></div>`).join('');
      scene.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.step===String(step))));
      scene.querySelector('.summary-profile-copy h3').textContent=step==='all'?'이번 이야기의 선택':`${Number(step)+1}번째 갈림길까지`;
    }
    scene.querySelectorAll('.summary-toggle').forEach(b=>b.addEventListener('click',()=>{
      const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));
      scene.querySelector('#summary-'+b.dataset.panel).hidden=!open;
    }));
    scene.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>updateChart(b.dataset.step)));
    scene.querySelector('.summary-download').addEventListener('click',()=>{
      const blob=new Blob([scene.querySelector('.summary-radar').innerHTML],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`loong-restaurant-choices-${ending}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    document.body.append(scene);scene.focus({preventScroll:true});if(previous)previous.remove();
    document.querySelectorAll('.prison-mouth-choice-white,.prison-mouth-choice-blue,.prison-self-escape-e-blue,.prison-reunion-d-ending').forEach(el=>el.remove());
    updateChart('all');
    const anim=scene.animate([{opacity:0},{opacity:1}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:800,fill:'forwards'});await anim.finished;scene.style.opacity='1';anim.cancel();return true;
  };
})();
