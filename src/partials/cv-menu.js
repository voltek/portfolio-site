  // "Download CV": its menu closes on Escape, on a click outside, after a choice and when the focus leaves it
  document.querySelectorAll("details.cv").forEach(d => {
    const close = () => { d.open = false; };
    document.addEventListener("click", e => { if (!d.contains(e.target) || e.target.closest(".cvmenu a")) close(); });
    d.addEventListener("keydown", e => { if (e.key === "Escape" && d.open) { close(); d.querySelector("summary").focus(); } });
    d.addEventListener("focusout", e => { if (e.relatedTarget && !d.contains(e.relatedTarget)) close(); });
  });
