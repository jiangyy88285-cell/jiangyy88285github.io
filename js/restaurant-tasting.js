(() => {
  "use strict";
  const lines = [
    "중동의 중식당에 도착한 서복은 사장 자이드를 만났다. 서복은 그를 친근하게 ‘자 선배’라고 불렀다.",
    "화구에 불이 오르고 웍이 달아올랐다. 서복은 30년 동안 갈고닦은 솜씨를 쏟아부어 정통 중국 요리로 한 상을 차렸다.",
    "그러나 몇 입 맛본 자이드는 고개를 저었다.",
    "“음식이 좀 짜네요.”",
    "“이곳 사람들은 단맛을 좋아해요.”",
    "“이런 요리는 국물을 너무 졸이지 말고 조금 더 남겨야 해요.”",
    "“그리고 중동 사람들은 매운 걸 좋아하지 않는데, 이 음식들은 전부 너무 맵네요.”",
    "서복은 목에 힘을 주었다. 전통 요리사로서의 자부심이 순간 치밀어 올랐다.",
    "“저는 30년 동안 요리를 해 왔습니다.”",
    "“중국 요리를 어떻게 해야 정통인지, 제가 가장 잘 압니다.”",
    "자이드는 웃으며 손을 내저었다. 말투는 차분했지만 현실을 꿰뚫는 영리함이 묻어났다.",
    "“손님들은 정통인지 아닌지보다 자기 입맛에 맞는지를 중요하게 생각해요.”",
    "하지만 서복에게도 양보할 수 없는 원칙과 고집이 있었다.",
    "“손님이 원한다면 조절할 수 있습니다.”",
    "“하지만 차이나타운에서 파는 쭤쭝탕 치킨이나 리훙장 잡탕 같은 건 절대 만들지 않겠습니다!”",
    "“그런 미국식 퓨전 요리는 중국 요리라고 할 수 없습니다.”",
    "“굳이 그런 걸 만들라고 하신다면, 차라리 지금 귀국하겠습니다!”"
  ];
  const leaving = [
    "서복이 막 밖으로 나가려 하자, 자이드가 입을 열었다.",
    "“당신의 소신에 마음이 움직였어요.”",
    "“용식당에 오신 것을 환영합니다.”"
  ];
  const ending = "‘정통’과 ‘현지화’를 둘러싼 논쟁은 결국 서복의 고집과 양보 사이에서 미묘한 균형을 찾았다. 그는 장인다운 탄탄한 솜씨로 중국 요리의 뼈대를 지키면서도 현지 사람들의 입맛을 받아들였고, 마침내 주방장의 웍을 맡게 되었다.";
  window.showRestaurantTasting = (preview = {}) => {
    const scene = document.createElement("section");
    scene.className = "tasting-scene"; scene.lang = "ko"; scene.tabIndex = -1;
    scene.setAttribute("aria-label", "용식당, 첫 요리와 선택");
    scene.innerHTML = '<div class="tasting-art"><img src="../js/images/restaurant-tasting-wide-v2.jpg" alt="식당 안에서 음식을 맛보는 자이드와 서복" class="is-visible" draggable="false"><img src="../js/images/restaurant-tasting-close-v2.jpg" alt="요리 한 상 앞에서 나누는 대화" draggable="false"></div><div class="tasting-wash"></div><p class="tasting-prose" aria-live="polite"></p><div class="tasting-choices" hidden><h2>이곳에 남아 요리사로 계속 일하시겠습니까?</h2><div class="tasting-choice-row"><button type="button" data-choice="leave">지금 떠나기로 한다.</button><button type="button" data-choice="stay">소신을 지키며 사장을 설득해 본다.</button></div></div>';
    const prose = scene.querySelector(".tasting-prose");
    const choices = scene.querySelector(".tasting-choices");
    const images = scene.querySelectorAll(".tasting-art img");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0, phase = "story", busy = false, branch = [], branchIndex = 0;
    const fade = (from,to,duration) => prose.animate([{opacity:from},{opacity:to}],
      {duration:reduced?0:duration,easing:"ease-in-out",fill:"forwards"}).finished;
    async function show(text, closeUp = true) {
      busy = true;
      await fade(1,0,280);
      images[0].classList.toggle("is-visible", !closeUp);
      images[1].classList.toggle("is-visible", closeUp);
      prose.textContent = text;
      await fade(0,1,800);
      busy = false;
    }
    async function conclude() {
      phase = "ending";
      await show(ending, false);
      scene.classList.add("is-complete");
      phase = "complete";
    }
    async function advance() {
      if (busy || phase === "choice" || phase === "ending") return;
      if (phase === "complete") {
        phase = "leaving";
        window.showFourMonths(); scene.remove(); return;
      }
      if (phase === "leaving") return;
      if (phase === "branch") {
        branchIndex++;
        if (branchIndex < branch.length) await show(branch[branchIndex]);
        else await conclude();
        return;
      }
      index++;
      if (index < lines.length) { await show(lines[index], index >= 3); return; }
      phase = "choice"; busy = true;
      await fade(1,0,280);
      choices.hidden = false;
      scene.focus({preventScroll:true});
      busy = false;
    }
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click",async event => {
      event.stopPropagation();
      if (busy || phase !== "choice") return;
      choices.hidden = true; scene.focus({preventScroll:true});
      window.recordStoryDecision?.("restaurantStay",button.dataset.choice);
      if (button.dataset.choice === "leave") {
        phase = "branch"; branch = leaving; branchIndex = 0;
        await show(branch[0]);
      } else await conclude();
    }));
    scene.addEventListener("click",event => { if(!event.target.closest("button")) advance(); });
    scene.addEventListener("keydown",event => {
      if(event.target.closest("button") || event.altKey || event.ctrlKey || event.metaKey) return;
      if(event.code === "Space" || event.key === "Enter") {event.preventDefault();advance();}
    });
    document.body.append(scene); prose.textContent = lines[0];
    scene.focus({preventScroll:true});
    if (preview.choices) {
      phase = "choice"; index = lines.length;
      prose.textContent = "";
      images[0].classList.remove("is-visible"); images[1].classList.add("is-visible");
      choices.hidden = false;
    } else {
      busy = true; fade(0,1,1000).then(()=>{busy=false;});
    }
  };
})();
