  // ---------- the section in view, marked in the bar of every page: {{>current-section.js}}, then currentSection(nav) with
  // the element that holds the bar's links. It is the last section whose top has passed under the bar. At the end of the
  // page, the last one in view (a short last section never reaches the bar). A chosen section stays marked until the page
  // moves away from where its jump landed, so a jump that can't put it at the top still marks the one asked for. It is
  // worked out from the sections' places every time, never from what entered or left the screen: turning back halfway
  // would leave it stale.
  function currentSection(nav){
    const root = document.documentElement, links = [...nav.querySelectorAll("a")], targets = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
    let chosenId = null, landed = null, timer = 0;
    const mark = id => links.forEach(a => a.setAttribute("aria-current", a.hash.slice(1) === id));
    const spy = () => {
      if (chosenId) return mark(chosenId);
      const line = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 24;
      let cur = null; targets.forEach(t => { if (t.getBoundingClientRect().top <= line) cur = t.id; });
      if (innerHeight + scrollY >= root.scrollHeight - 2) targets.forEach(t => { if (t.getBoundingClientRect().top < innerHeight * .6) cur = t.id; });
      mark(cur); };
    // landed: where the page rests once the jump ends (200 ms without moving; a jump may also not move at all)
    const settle = () => { clearTimeout(timer); timer = setTimeout(() => landed = scrollY, 200); };
    const release = () => { if (!chosenId) return; clearTimeout(timer); chosenId = landed = null; spy(); };
    links.forEach(a => a.addEventListener("click", e => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // opens elsewhere
      chosenId = a.hash.slice(1); landed = null; mark(chosenId); settle(); }));
    // the visitor takes over before the jump ends: by hand, or with another link of the page
    const takeOver = () => { if (landed === null) release(); };
    addEventListener("wheel", takeOver, { passive:true }); addEventListener("touchstart", takeOver, { passive:true });
    document.addEventListener("click", e => { const a = e.target.closest('a[href^="#"]'); if (a && !nav.contains(a)) release(); });
    addEventListener("scroll", () => { if (chosenId && landed === null) settle();
      if (chosenId && landed !== null && Math.abs(scrollY - landed) > 2) release(); else spy(); }, { passive:true });
    addEventListener("resize", spy); addEventListener("load", spy); spy();
    // the page grows and shrinks without scrolling (the Skills detail)
    new ResizeObserver(spy).observe(document.body);
  }
