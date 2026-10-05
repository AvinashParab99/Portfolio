/* ============================================================================
   MAIN — ek hi animation loop. Baaki files `App.onTick(fn)` se register hoti hain;
   yahan sab ek-ek karke chalte hain, aur last me WebGL render hota hai.
   ============================================================================ */

(function startLoop() {
  function frame(timeMs) {
    requestAnimationFrame(frame);
    App.time = timeMs * 0.001;
    App._tickers.forEach(fn => fn(timeMs));

    // marquee (scroll ke saath chalta text)
    marquee.style.transform = `translateX(${-(scrollY * 0.5) % 1100}px)`;

    GL.render();
  }
  const marquee = $('#marquee');
  requestAnimationFrame(frame);
})();
