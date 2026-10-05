/* ============================================================================
   HERO — parallax: mouse se alag-alag depth ki layers hilti hain, scroll par
   alag speed se upar jaati hain. Har element par:
     data-depth = mouse movement (px)   |   data-speed = scroll parallax factor
   ============================================================================ */

(function setupHero() {
  const hero   = $('.hero');
  const center = $('#heroCenter');

  const layers = $$('.px').map(el => ({
    el,
    depth: parseFloat(el.dataset.depth) || 0,
    speed: parseFloat(el.dataset.speed) || 0
  }));

  let mx = 0, my = 0;   // smoothed mouse (-1 .. 1)

  App.onTick(() => {
    if (scrollY > App.H * 1.3) return;           // hero nikal gaya, kaam mat karo

    mx = lerp(mx, App.mouse.nx, 0.06);
    my = lerp(my, App.mouse.ny, 0.06);

    layers.forEach(layer => {
      const x = -mx * layer.depth;
      const y = -my * layer.depth + scrollY * layer.speed;
      layer.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    // poora headline group halka 3D tilt
    center.style.transform = `rotateY(${mx * 5}deg) rotateX(${-my * 3.5}deg)`;

    // scroll par hero fade
    hero.style.setProperty('--fade', clamp(1 - scrollY / (App.H * 0.75), 0, 1).toFixed(3));
  });
})();
