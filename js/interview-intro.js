(() => {
  "use strict";
  const start = document.querySelector('[data-menu="start"]');
  const opening = document.getElementById("opening-experience");
  if (!start || !opening) return;
  const lines = [
    "서 선생님.",
    "서 선생님.",
    "저희 나라에 오신 목적이 무엇입니까?",
    "화상회 초청으로 친목 모임에 참석하러 왔습니다.\n여기 초청장입니다.",
    "기록에 따르면 저희 나라에 처음 오신 건 2002년 11월이군요.\n당시 방문 목적은 무엇이었습니까?",
    "일하러 왔습니다.\n중식당에서 요리사로 일했습니다.",
    "2년 뒤, 선생님의 기록에\n테러 공격을 도운 혐의가 추가됐습니다.",
    "하지만 나중에 저와는 무관한 일로 밝혀졌습니다.",
    "중국인인 선생님에게 왜 이런 기록이 남아 있는지\n설명해 주시겠습니까?",
    "기록에 다 적혀 있잖습니까.\n제가 더 뭘 설명해야 합니까.",
    "기록에는 그 공격으로 미군 세 명뿐 아니라\n민간인 여섯 명도 사망했다고 적혀 있습니다.\n그중에는 다섯 살 아이도 있었습니다.",
    "서 선생님, 테러를 돕는 행위는 중범죄입니다.\n당시 선생님에게 혐의가 없다는 결론을 내린 건 미국 측입니다.",
    "저희는 그 조사에 참여하지 않았습니다.\n그러니 명확하게 설명하시는 게 좋겠습니다.\n그렇지 않으면 입국을 허가할 수 없습니다.\n보안 당국에 신병을 인계하게 될 겁니다."
  ];
  let bypass = false, screen = null;
  start.addEventListener("click", event => {
    if (bypass) { bypass = false; return; }
    event.preventDefault(); event.stopImmediatePropagation();
    if (screen) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousInert = opening.inert;
    opening.inert = true;
    opening.hidden = true;
    screen = document.createElement("button");
    screen.type = "button";
    screen.className = "interview-intro";
    screen.lang = "ko";
    screen.setAttribute("aria-label", "클릭하거나 Enter 키를 눌러 다음 대화로");
    const line = document.createElement("span");
    line.className = "interview-line";
    line.setAttribute("aria-live", "polite");
    screen.append(line); document.body.append(screen);
    screen.focus({preventScroll: true});
    let index = 0, busy = true;
    const fade = (element, from, to, duration) => element.animate(
      [{opacity: from}, {opacity: to}],
      {duration: reduced ? 0 : duration, easing: "ease-in-out", fill: "forwards"}
    ).finished;
    async function showLine() {
      line.textContent = `“${lines[index]}”`;
      await fade(line, 0, 1, 750);
      busy = false;
    }
    screen.addEventListener("click", async () => {
      if (busy) return;
      busy = true;
      await fade(line, 1, 0, 350);
      index++;
      if (index < lines.length) { await showLine(); return; }
      // Mount the next scene first; never uncover the opening menu between scenes.
      const gallery = window.showMemoryGallery();
      screen.remove(); screen = null;
      await gallery;
      opening.inert = previousInert;
      bypass = true; start.click();
      document.getElementById("story-title")?.focus({preventScroll: true});
    });
    showLine();
  }, true);
})();
