(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const KEY=document.body.dataset.scenePreview ? "dragon-scene-visual-preview-v3" : "dragon-restaurant-scene-preview-v3", PREF="dragon-restaurant-preferences-v1";
  const opening=$("opening-experience"), view=$("game-view"), dialog=$("game-dialog");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state=null, history=[], active=false, locked=false, audio=null, saveOK=true;
  let prefs={lang:"ko",sound:false,gentle:reduced};
  try {prefs={...prefs,...JSON.parse(localStorage.getItem(PREF)||"{}")};} catch(_){}
  if(!["ko","zh"].includes(prefs.lang)) prefs.lang="ko";
  const tr=(zh,ko)=>prefs.lang==="zh" ? zh : ko;
  const txt=pair=>pair?.[prefs.lang]||pair?.zh||"";
  const esc=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const copy=value=>JSON.parse(JSON.stringify(value));
  const memoryNames={
    family:{zh:"剪小的全家福",ko:"작게 오린 가족사진"},spoon:{zh:"孩子手中的勺子",ko:"아이의 손에 들린 국자"},
    bowl:{zh:"递向老扎的一碗饭",ko:"자 선배에게 건넨 밥"},tooth:{zh:"留下来的金牙",ko:"남겨진 금니"},
    phone:{zh:"一分钟的电话",ko:"일 분의 전화"},bag:{zh:"装着谎言的书包",ko:"거짓말이 담긴 가방"},
    cola:{zh:"没有打开的可乐",ko:"열지 못한 콜라"},road:{zh:"越过边境的路",ko:"국경을 넘는 길"},rice:{zh:"徐福烩饭",ko:"서복 볶음밥"}
  };
  const chapterQuotes=[
    {zh:"记忆从来不按时间出现。",ko:"기억은 시간의 순서대로 오지 않는다."},
    {zh:"在枪声之前，先有饭菜的声音。",ko:"총성보다 먼저, 밥 짓는 소리가 있었다."},
    {zh:"窗外的战争，也会走进屋里。",ko:"창밖의 전쟁은 방 안으로도 들어온다."},
    {zh:"门被关上，锅里的水仍在沸腾。",ko:"문은 닫혔지만 솥의 물은 여전히 끓었다."},
    {zh:"他们不是你的孩子。\n那也是孩子。",ko:"당신의 아이들이 아니잖아.\n저 아이들도 아이예요."},
    {zh:"好好吃饭，比什么都重要。",ko:"밥 잘 챙겨 먹는 게 무엇보다 중요해."}
  ];

  function normalise(raw) {
    if(!raw || !STORY.nodes[raw.id]) return null;
    const scores={};for(const k of ["trauma","burden","bond"]) scores[k]=Math.max(0,Math.min(100,Number(raw.scores?.[k])||0));
    return {id:raw.id,paragraph:Math.max(0,Number(raw.paragraph)||0),scores,flags:raw.flags&&typeof raw.flags==="object"?raw.flags:{},
      visited:[...new Set((Array.isArray(raw.visited)?raw.visited:[]).filter(id=>STORY.nodes[id]))],
      memories:[...new Set((Array.isArray(raw.memories)?raw.memories:[]).filter(id=>memoryNames[id]))],
      trail:(Array.isArray(raw.trail)?raw.trail:[]).filter(x=>x&&STORY.nodes[x.id]&&x.label?.zh&&x.label?.ko),
      started:raw.started||new Date().toISOString()};
  }
  function stored() {
    try {const data=JSON.parse(localStorage.getItem(KEY)||"null");if(data?.version!==STORY.version)return null;
      const restored=normalise(data.state);return restored?{state:restored,history:(data.history||[]).map(normalise).filter(Boolean)}:null;
    } catch(_){return null;}
  }
  function save() {
    try {localStorage.setItem(KEY,JSON.stringify({version:STORY.version,state,history}));saveOK=true;}catch(_){saveOK=false;}
  }
  function savePrefs(){try{localStorage.setItem(PREF,JSON.stringify(prefs));}catch(_){}document.body.classList.toggle("gentle-motion",!!prefs.gentle);}
  function affect(effect={}){for(const [k,v] of Object.entries(effect)) if(k in state.scores)state.scores[k]=Math.max(0,Math.min(100,state.scores[k]+v));}
  function enter(id){
    state.id=id;state.paragraph=0;const n=STORY.nodes[id];affect(n.effect);
    if(!state.visited.includes(id))state.visited.push(id);
    if(n.memory&&(!n.conditionalMemory||state.flags[n.conditionalMemory])&&!state.memories.includes(n.memory))state.memories.push(n.memory);
    save();render();
  }
  function newGame(){history=[];state={id:STORY.start,scores:{trauma:6,burden:3,bond:12},flags:{},visited:[],memories:[],trail:[],started:new Date().toISOString()};openGame();enter(STORY.start);}
  function openGame(){active=true;opening.hidden=true;view.hidden=false;document.body.classList.add("game-mode");window.scrollTo(0,0);}
  function start(){
    closeDialog();const data=stored();
    if(data){state=data.state;history=data.history;openGame();render();}else newGame();
  }
  function home(){closeDialog();active=false;view.hidden=true;opening.hidden=false;document.body.classList.remove("game-mode");window.scrollTo(0,0);}
  function advance(to,choice){
    if(locked||!STORY.nodes[to])return;
    locked=true;history.push(copy(state));
    if(choice){state.trail.push({id:state.id,label:choice.label,chapter:STORY.nodes[state.id].ch});affect(choice.effect);Object.assign(state.flags,choice.flag||{});}
    enter(to);unlockSoon();
  }
  function unlockSoon(){setTimeout(()=>{locked=false;document.querySelectorAll('#story-actions button').forEach(b=>b.disabled=false);},prefs.gentle?100:420);}
  function nextStep(){
    const n=STORY.nodes[state.id],lines=txt(n.body).split("\n");
    if(locked)return;
    if((state.paragraph||0)<lines.length-1){locked=true;history.push(copy(state));state.paragraph=(state.paragraph||0)+1;save();render();unlockSoon();}
    else if(n.next){if(n.interaction==="lamp")sound("memory");advance(n.next);}
  }
  function back(){if(!history.length||locked)return;state=history.pop();save();render();}
  function button(label,callback,cls=""){const b=document.createElement("button");b.type="button";b.textContent=label;b.className=cls;b.addEventListener("click",callback);return b;}
  function sound(cue){
    if(!prefs.sound)return;
    try{
      audio ||= new (window.AudioContext||window.webkitAudioContext)();if(audio.state==="suspended")audio.resume();
      const t=audio.currentTime, gain=audio.createGain();gain.connect(audio.destination);
      const osc=audio.createOscillator();osc.type=cue==="impact"?"triangle":"sine";
      osc.frequency.setValueAtTime(cue==="impact"?83:cue==="loss"?145:310,t);
      osc.frequency.exponentialRampToValueAtTime(cue==="impact"?36:180,t+.25);
      gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.045,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+.45);
      osc.connect(gain);osc.start(t);osc.stop(t+.5);
    }catch(_){}
  }
  function render(){
    if(!state)return;const n=STORY.nodes[state.id],ch=STORY.chapters[n.ch];
    document.documentElement.lang=prefs.lang==="ko"?"ko":"zh-CN";
    $("game-language").textContent=prefs.lang==="ko"?"中文":"한국어";
    $("game-contents").textContent=tr("章节","목차");$("game-notebook").textContent=tr("记忆簿","기록");
    $("game-help").textContent=tr("说明","안내");$("game-sound").textContent=prefs.sound?tr("声音开","소리 켬"):tr("声音关","소리 끔");
    $("game-sound").setAttribute("aria-pressed",String(prefs.sound));
    $("chapter-progress").textContent=(n.ch===0?"PROLOGUE":`CHAPTER ${String(n.ch).padStart(2,"0")} / 05`)+"  ·  "+txt(ch);
    const metrics=[["trauma",tr("创伤负荷","기억의 충격")],["burden",tr("道德重负","마음의 무게")],["bond",tr("人与人的连结","사람과의 연결")]];
    $("state-marks").innerHTML=metrics.map(([k,label])=>`<span class="state-mark"><span>${label}</span><i style="--level:${state.scores[k]}%"></i><b>${state.scores[k]}</b></span>`).join("");
    $("story-meta").textContent=tr("一段留下来的记忆","남겨진 기억")+" / "+String(state.visited.length).padStart(2,"0")+(n.adapted?tr(" · 分支推演"," · 각색 분기"):"");
    const lines=txt(n.body).split("\n");
    const paragraph=Math.min(state.paragraph||0,lines.length-1);
    const lastParagraph=paragraph>=lines.length-1;
    const showChoices=!!n.choices&&lastParagraph;
    const prompts={stay:{zh:"是否留在这里，继续营业？",ko:"이곳에 남으시겠습니까?"},stayed:{zh:"要把这瓶酒卖给他吗？",ko:"이 술을 팔겠습니까?"},'loss-home':{zh:"你会怎样陪伴老扎？",ko:"그의 곁에 어떻게 머물겠습니까?"},'prison-kitchen':{zh:"要暗中帮助这个囚犯吗？",ko:"이 죄수를 몰래 돕겠습니까?"},pepper:{zh:"塞夫会撒下辣椒粉吗？",ko:"세이프는 고춧가루를 뿌릴까요?"},christmas:{zh:"接受这个换取自由的条件吗？",ko:"자유를 위한 조건을 받아들일까요?"}};
    $("story-title").textContent=showChoices&&prompts[n.id]?txt(prompts[n.id]):txt(n.title);
    $("story-prose").replaceChildren();
    const p=document.createElement("p");p.textContent=lines[paragraph];$("story-prose").appendChild(p);
    const art=$("collage-art");
    const artFile=["interview","family-scene","war-scene","night-scene"].includes(n.art)?`${n.art}.png`:`${n.art}.jpg`;
    if(art.getAttribute('src')!==`../js/images/story/${artFile}`){art.src=`../js/images/story/${artFile}`;art.style.animation='none';void art.offsetWidth;art.style.animation='';}
    art.alt=txt(n.title);
    $("collage-stage").className="collage-stage art-"+n.art+(n.ch===3?" confined":"");
    $("collage-number").textContent=n.ch===0?"2002":"0"+n.ch;
    $("collage-chapter").textContent=txt(ch);$("collage-quote").textContent=txt(chapterQuotes[n.ch]);
    const memory=n.memory&&state.memories.includes(n.memory);
    $("memory-slip").hidden=!memory;
    if(memory){$("memory-caption").textContent=txt(memoryNames[n.memory]);$("memory-image").src=`../js/images/story/${n.memory==="family"?"family":n.memory==="rice"||n.memory==="bowl"?"meal":n.memory==="road"?"desert":"portrait"}.jpg`;$("memory-image").alt=txt(memoryNames[n.memory]);}
    $("story-actions").replaceChildren();
    if(!lastParagraph){$("story-actions").append(button(tr("轻点画面继续","화면을 눌러 계속하기"),nextStep,"continue-button"));}
    else if(n.end){$("story-actions").append(button(tr("回看这段旅程的选择","지금까지의 선택 돌아보기"),()=>showReport(),"continue-button"));}
    else if(showChoices){n.choices.forEach((choice,i)=>{const b=button(txt(choice.label),()=>advance(choice.to,choice),"choice-button");b.dataset.choice=i;$("story-actions").append(b);});}
    else if(n.next){$("story-actions").append(button(n.action?txt(n.action):tr("轻点画面继续","화면을 눌러 계속하기"),nextStep,n.interaction==="lamp"?"continue-button lamp-button":"continue-button"));}
    document.querySelectorAll('#story-actions button').forEach(b=>b.disabled=locked);
    $("story-feedback").textContent=n.end?tr("第一场景预览 · 可回看选择或返回开场","첫 장면 미리보기 · 선택을 돌아보거나 처음으로"):"";
    $("game-back").textContent=tr("上一页","이전 페이지");$("game-back").disabled=!history.length;
    $("save-indicator").textContent=saveOK?tr("已自动保存","자동 저장됨"):tr("当前窗口内保留","현재 창에서 보관됨");
    $("game-footnote").textContent=tr("每一次翻页，都是回到记忆的一种方式。","페이지를 넘기는 일은 기억으로 돌아가는 한 가지 방법이다.");
    const sheet=$("story-sheet");sheet.className='story-sheet'+(showChoices?' choice-scene':'')+(n.end&&lastParagraph?' end-scene':'')+(n.interaction==='lamp'&&lastParagraph?' lamp-scene':'');
    $("reading-layout").dataset.clickable=String(!showChoices&&(!n.end||!lastParagraph));
    if(n.cue){sound(n.cue);if(!prefs.gentle){$("reading-layout").classList.remove("cue-impact");void $("reading-layout").offsetWidth;$("reading-layout").classList.add("cue-impact");}}
    $("story-title").focus({preventScroll:true});
  }

  function showDialog(title,html){$("dialog-title").textContent=title;$("dialog-content").innerHTML=html;if(!dialog.open)dialog.showModal();}
  function closeDialog(){if(dialog.open)dialog.close();}
  function showHelp(){
    showDialog(tr("如何进入这段记忆","기억을 읽는 방법"),`<p>${tr("点击画面逐段阅读，轻点桌上的灯推进夜晚。在这一版中，只制作餐馆日常及战争后的第一次去留选择。","화면을 눌러 한 단락씩 읽고, 탁상등을 눌러 밤을 이어 갑니다. 이번 버전은 식당의 일상과 전쟁 뒤 첫 번째 선택까지만 담았습니다.")}</p><p>${tr("进度会自动保存在本机浏览器。上一页可以回看并改选；右上角可切换中文、韩文和声音。数字键 1 / 2 选择，空格翻页。","진행은 이 브라우저에 자동 저장됩니다. 이전 페이지로 돌아가 다른 선택을 할 수 있습니다. 언어와 소리는 위에서 바꿀 수 있습니다. 숫자 1 / 2는 선택, 스페이스는 다음 페이지입니다.")}</p><p>${tr("创伤负荷、道德重负、连结是虚构的叙事指标，用来呈现人物处境；不是临床量表，也不给玩家的道德打分。","기억의 충격, 마음의 무게, 연결은 인물의 상황을 나타내는 허구의 서사 지표입니다. 임상 척도나 플레이어의 도덕 점수가 아닙니다.")}</p><label class="setting-row"><input id="gentle-setting" type="checkbox" ${prefs.gentle?"checked":""}> ${tr("柔和画面，减少震动与动态效果","부드러운 화면: 흔들림과 움직임 줄이기")}</label><button class="dialog-primary" id="help-begin">${tr("继续阅读","계속 읽기")}</button>`);
    $("gentle-setting").addEventListener("change",e=>{prefs.gentle=e.target.checked;savePrefs();});
    $("help-begin").onclick=()=>{closeDialog();if(!active)start();};
  }
  function showChapters(){
    const current=state||stored()?.state;
    showDialog(tr("这一段的记忆","이 장면의 기억"),`<p>${tr("已读章节可以回看。未抵达的章节会随故事逐渐展开。","읽은 장으로 돌아갈 수 있습니다. 아직 닿지 않은 장은 이야기를 따라 열립니다.")}</p><div class="chapter-list">${STORY.chapters.map((ch,i)=>{
      if(i<1||i>2)return "";
      const visited=!!current?.visited.some(id=>STORY.nodes[id].ch===i);
      return `<button data-chapter="${i}" ${visited?"":"disabled"}><b>${i===0?"00":String(i).padStart(2,"0")}</b><span>${esc(txt(ch))}</span><small>${visited?tr("已抵达","읽음"):tr("未抵达","아직")}</small></button>`;
    }).join("")}</div>`);
    dialog.querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>{
      if(!state){const data=stored();if(!data)return;state=data.state;history=data.history;}
      const ch=Number(b.dataset.chapter);let index=history.findIndex(s=>STORY.nodes[s.id].ch===ch);
      if(index>=0){state=copy(history[index]);history=history.slice(0,index);save();}
      closeDialog();openGame();render();
    });
  }
  function showMore(){
    showDialog(tr("关于这段故事","이 이야기에 관하여"),`<p>${tr("这是一段围绕徐福、马俊生、塞夫与龙餐馆的叙事预览。依据故事书与作业导图，参照新视频制作纸纹、深浅蓝剪纸和通栏场景。","서복, 마준생, 세이프와 용식당을 중심으로 한 분기형 서사 게임입니다. 제공된 이야기책과 흐름도를 바탕으로 종이, 푸른 실루엣, 콜라주 표현을 이어 갑니다.")}</p><p>${tr("本次只做到第一次去留选择。后面的入狱、营地与逃亡还没有接入；选择回家的短结局是互动改编。","이번 버전은 첫 번째 떠남과 머묾의 선택까지만 담았습니다. 감옥, 캠프와 탈출은 아직 연결하지 않았습니다. 귀가 결말은 각색한 분기입니다.")}</p><p>${tr("画面素材提取自《脉络》和《作业导图 1》中的参考图；没有把文档里的规划说明当作游戏内指令。","화면은 제공된 시각 자료와 과제 흐름도에서 추출했습니다. 자료 속 제작 설명은 플레이어에게 내리는 지시로 사용하지 않았습니다.")}</p><div class="resource-links">${STORY.resources.map(r=>`<a href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a>`).join("")}</div>`);
  }
  function showNotebook(){
    if(!state){start();return;}
    showDialog(tr("记忆簿","기억의 조각"),`<p>${tr("有些东西没有带走，却一直留在记忆里。","가져오지 못했어도 기억에 남은 것들이 있습니다.")}</p><div class="memory-grid">${state.memories.length?state.memories.map((id,i)=>`<article><small>${String(i+1).padStart(2,"0")}</small><h3>${esc(txt(memoryNames[id]))}</h3></article>`).join(""):`<p>${tr("翻开故事，记忆会逐渐留下。","이야기를 읽으며 기억이 하나씩 남습니다.")}</p>`}</div>`);
  }
  function showReport(){
    const n=STORY.nodes[state.id];
    showDialog(tr("这一小段的选择记录","이 장면에 남긴 선택"),`<p class="report-ending">${esc(txt(n.ending||n.title))}</p><div class="report-grid"><section><h3>${tr("一路做过的选择","걸어온 선택")}</h3><ol class="choice-record">${state.trail.map(t=>`<li><small>${esc(txt(STORY.chapters[t.chapter]))}</small><span>${esc(txt(t.label))}</span></li>`).join("")||`<li>${tr("这段旅程尚未留下选择。","아직 선택이 없습니다.")}</li>`}</ol></section><section><h3>${tr("把生活重新接起来","삶을 다시 이어 가기")}</h3><p>${tr("餐桌、可以安心停留的地方、愿意听你说话的人——故事没有让伤疤消失，而是让日常重新有了位置。","식탁, 안심하고 머물 곳, 이야기를 들어 주는 사람. 이야기는 흉터를 지우지 않고 일상이 다시 놓일 자리를 남깁니다.")}</p><p>${tr("此处是人物叙事的回顾，不是心理评估或治疗建议。了解战争与流离失所者的心理支持，可阅读下方机构资料。","이 기록은 인물 서사의 회고이며 심리 평가나 치료 권고가 아닙니다. 분쟁과 이주 상황의 심리 지원은 아래 기관 자료에서 읽을 수 있습니다.")}</p><div class="resource-links">${STORY.resources.map(r=>`<a href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a>`).join("")}</div></section></div><div class="report-buttons"><button id="report-export">${tr("保存记忆档案","기록 저장")}</button><button id="report-back">${tr("回到上一次选择","이전 선택으로")}</button><button id="report-restart">${tr("开启新的旅程","새 여정 시작")}</button></div>`);
    $("report-export").onclick=exportReport;
    $("report-back").onclick=()=>{closeDialog();back();};
    $("report-restart").onclick=confirmNew;
  }
  function exportReport(){
    const n=STORY.nodes[state.id];const report=["용식당 / 龙餐馆 · 记忆档案",txt(n.ending||n.title),"",...state.trail.map((t,i)=>`${i+1}. ${txt(STORY.chapters[t.chapter])}：${txt(t.label)}`),"",tr("记忆碎片：","기억의 조각: "),...state.memories.map(id=>txt(memoryNames[id])),"",tr("叙事记录，不是临床评估。","서사 기록이며 임상 평가가 아닙니다.")].join("\n");
    const url=URL.createObjectURL(new Blob(["\ufeff"+report],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="龙餐馆-记忆档案.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function confirmNew(){showDialog(tr("重新展开这段记忆？","기억을 다시 펼칠까요?"),`<p>${tr("当前阅读进度将被新旅程替换。你可以先保存结局档案。","현재 읽기 진행은 새 여정으로 바뀝니다. 먼저 결말 기록을 저장할 수 있습니다.")}</p><div class="report-buttons"><button id="confirm-new">${tr("开始新旅程","새 여정 시작")}</button><button id="cancel-new">${tr("保留当前进度","현재 기록 유지")}</button></div>`);$("confirm-new").onclick=()=>{closeDialog();newGame();};$("cancel-new").onclick=closeDialog;}
  document.querySelectorAll("[data-menu]").forEach(b=>b.addEventListener("click",()=>({start,help:showHelp,chapters:showChapters,more:showMore}[b.dataset.menu])()));
  $("game-home").onclick=home;$("game-contents").onclick=showChapters;$("game-notebook").onclick=showNotebook;$("game-help").onclick=showHelp;
  $("game-back").onclick=back;$("dialog-close").onclick=closeDialog;
  $("game-language").onclick=()=>{prefs.lang=prefs.lang==="ko"?"zh":"ko";savePrefs();render();};
  $("game-sound").onclick=()=>{prefs.sound=!prefs.sound;savePrefs();render();if(prefs.sound)sound("memory");};
  $("reading-layout").addEventListener('click',event=>{if(event.target.closest('button,a,input')||!active||dialog.open)return;const n=STORY.nodes[state.id];const last=(state.paragraph||0)>=txt(n.body).split('\n').length-1;if((!n.choices||!last)&&(!n.end||!last))nextStep();});
  dialog.addEventListener("click",event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
  document.addEventListener("keydown",event=>{
    if(!active||dialog.open||event.altKey||event.metaKey||event.ctrlKey||event.target.closest("button,a,input,select,textarea"))return;
    const n=STORY.nodes[state.id];
    const last=(state.paragraph||0)>=txt(n.body).split('\n').length-1;
    if(["1","2"].includes(event.key)&&n.choices&&last){event.preventDefault();const choice=n.choices[Number(event.key)-1];if(choice)advance(choice.to,choice);}
    else if(event.code==="Space"&&(!n.choices||!last)&&(!n.end||!last)){event.preventDefault();nextStep();}
  });
  savePrefs();
  if(document.body.dataset.scenePreview==="true")newGame();
})();
