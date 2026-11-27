  // ---------- the top bar of Quick's world: one copy, included by the build as {{>bar-read.js}} (DESIGN.md, the Bar Menu Rule).
  // It needs {{>current-section.js}} before it, #top, .mast with .who and .right, nav#nav with links to the page's sections, #theme and #menu.
  (() => {
    const root = document.documentElement, top = document.getElementById("top"), mast = top.querySelector(".mast");
    const nav = document.getElementById("nav"), menu = document.getElementById("menu"), btn = document.getElementById("theme");

    // theme: a click is remembered; until then the page follows the system setting, live (?theme= forces one)
    const sys = matchMedia("(prefers-color-scheme: dark)"), forced = new URLSearchParams(location.search).has("theme");
    let chosen = false; try { chosen = !!localStorage.getItem("ah-theme"); } catch (e) {}
    const set = (v, save) => { root.dataset.theme = v; btn.setAttribute("aria-label", v === "dark" ? btn.dataset.toLight : btn.dataset.toDark);
      if (save) { chosen = true; try { localStorage.setItem("ah-theme", v); } catch (e) {} } };
    set(root.dataset.theme, false);
    btn.addEventListener("click", () => set(root.dataset.theme === "dark" ? "light" : "dark", true));
    sys.addEventListener("change", ev => { if (!chosen && !forced) set(ev.matches ? "dark" : "light", false); });
    // coming back with Back (the page restored from memory) or a theme changed in another tab: follow the saved choice
    const follow = () => { if (forced) return; try { const t = localStorage.getItem("ah-theme"); if (t === "dark" || t === "light") set(t, false); } catch (e) {} };
    addEventListener("pageshow", e => { if (e.persisted) follow(); }); addEventListener("storage", e => { if (e.key === "ah-theme") follow(); });

    // the menu, only when the sections don't fit: inline while at least 40 px stay free between the name and the rest
    const who = mast.querySelector(".who"), right = mast.querySelector(".right");
    let openedAt = 0;
    const isOpen = () => nav.classList.contains("open");
    const shut = back => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); if (back) menu.focus({ preventScroll:true }); };
    const fit = () => { const was = mast.classList.contains("compact"); mast.classList.remove("compact");
      const tight = mast.clientWidth - who.offsetWidth - right.offsetWidth < 40; mast.classList.toggle("compact", tight); if (was && !tight) shut(false); };
    new ResizeObserver(fit).observe(mast); document.fonts.ready.then(fit);
    // opening moves focus to the first item without scrolling (a plain focus() scrolls the page under the bar)
    menu.addEventListener("click", () => { if (isOpen()) return shut(false);
      nav.classList.add("open"); menu.setAttribute("aria-expanded", "true"); openedAt = scrollY; nav.querySelector("a").focus({ preventScroll:true }); });
    // it closes with any link in the bar (a section, the page's own action, the name), Esc, a tap outside the bar,
    // focus leaving the bar, or the page scrolling on (it would cover what the visitor is now reading)
    top.addEventListener("click", e => { if (isOpen() && e.target.closest("a")) shut(false); });
    addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) shut(true); });
    addEventListener("pointerdown", e => { if (isOpen() && !top.contains(e.target)) shut(false); });
    top.addEventListener("focusout", e => { if (isOpen() && e.relatedTarget && !top.contains(e.relatedTarget)) shut(false); });
    addEventListener("scroll", () => { if (isOpen() && Math.abs(scrollY - openedAt) > 24) shut(false); }, { passive:true });

    // the shadow once the page moves under the bar
    const stuck = () => top.classList.toggle("stuck", scrollY > 4); addEventListener("scroll", stuck, { passive:true }); stuck();

    currentSection(nav);
  })();
