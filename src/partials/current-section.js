  // ---------- the section in view, marked in the bar of every page: {{>current-section.js}}, then currentSection(nav) with
  // the element that holds the bar's links. It is the last section whose top has passed under the bar. At the end of the
  // page, the last one in view (a short last section never reaches the bar). A chosen section stays marked until the
  // visitor scrolls by hand, so a jump that can't put it at the top still marks the one asked for. It is worked out from
  // the sections' places every time, never from what entered or left the screen: turning back halfway would leave it stale.
  function currentSection(nav){
    const root = document.documentElement, links = [...nav.querySelectorAll("a")], targets = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
    let chosenId = null;
    const mark = id => links.forEach(a => a.setAttribute("aria-current", a.hash.slice(1) === id));
    const spy = () => {
      if (chosenId) return mark(chosenId);
      const line = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 24;
      let cur = null; targets.forEach(t => { if (t.getBoundingClientRect().top <= line) cur = t.id; });
      if (innerHeight + scrollY >= root.scrollHeight - 2) targets.forEach(t => { if (t.getBoundingClientRect().top < innerHeight * .6) cur = t.id; });
      mark(cur); };
    links.forEach(a => a.addEventListener("click", () => { chosenId = a.hash.slice(1); mark(chosenId); }));
    const byHand = () => { if (chosenId) { chosenId = null; spy(); } };
    addEventListener("wheel", byHand, { passive:true }); addEventListener("touchstart", byHand, { passive:true });
    addEventListener("keydown", e => { if (/^(Arrow|Page|Home|End| )/.test(e.key)) byHand(); });
    addEventListener("scroll", spy, { passive:true }); addEventListener("resize", spy); addEventListener("load", spy); spy();
    // the page grows and shrinks without scrolling (the Skills detail)
    new ResizeObserver(spy).observe(document.body);
  }
