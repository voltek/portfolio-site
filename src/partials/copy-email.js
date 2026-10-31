  // copy the address: the icon turns into a check and "Copied" shows (and is read aloud) for two seconds
  document.querySelectorAll(".copy").forEach(btn => {
    const said = btn.nextElementSibling; let t;
    btn.addEventListener("click", async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(btn.dataset.copy); ok = true; } catch (e) {
        // no clipboard API (an old browser or a file:// page): the old way, through a selected hidden field
        const f = Object.assign(document.createElement("textarea"), { value: btn.dataset.copy, readOnly: true });
        f.style.cssText = "position:fixed;opacity:0"; document.body.append(f); f.select();
        try { ok = document.execCommand("copy"); } catch (e) {} f.remove();
      }
      if (!ok) return;
      btn.classList.add("done"); said.textContent = said.dataset.text;
      clearTimeout(t); t = setTimeout(() => { btn.classList.remove("done"); said.textContent = ""; }, 2000);
    });
  });
