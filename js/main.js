/* Yoimiya — cursor glow + card tilt. Respects prefers-reduced-motion. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !matchMedia("(pointer: fine)").matches) return;

  /* ---- 1. cursor-following glow ---- */
  const glow = document.createElement("div");
  glow.style.cssText = `
    position:fixed;left:0;top:0;width:560px;height:560px;pointer-events:none;z-index:0;
    transform:translate(-50%,-50%);
    background:radial-gradient(circle,rgba(61,255,180,.055) 0%,rgba(61,255,180,.02) 35%,transparent 65%);
    will-change:transform;transition:opacity .4s;`;
  document.body.appendChild(glow);
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; }, { passive: true });
  addEventListener("pointerleave", () => { glow.style.opacity = 0; });
  (function loop() {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    glow.style.transform = `translate(${x - 280}px,${y - 280}px)`;
    requestAnimationFrame(loop);
  })();

  /* ---- 2. subtle 3D tilt on interactive cards ---- */
  const MAX = 5; // degrees
  document.querySelectorAll(".term, .about-card, .c-card").forEach(card => {
    let raf = null;
    card.addEventListener("pointermove", e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .08s linear";
        card.style.transform =
          `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateY(-2px)`;
      });
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
      card.style.transform = "";
    });
  });

  /* ---- 3. nav link underline slides from cursor ---- */
  document.querySelectorAll(".top nav a").forEach(a => {
    a.addEventListener("pointerenter", e => {
      const r = a.getBoundingClientRect();
      a.style.setProperty("--u-x", `${e.clientX - r.left}px`);
    });
  });
})();
