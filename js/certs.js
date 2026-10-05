/* ============================================================================
   CERTS — naam par hover karo to certificate ka preview cursor ke saath chalta
   hai. Preview box fixed size ka hai aur image `contain` hoti hai, isliye koi
   bhi jpg/png bina crop ke poori dikhti hai.
   ============================================================================ */

(function setupCerts() {
  const preview = $('#certPreview');
  const image   = $('img', preview);
  let x = 0, y = 0, active = false;

  $$('.cert').forEach(row => {
    row.addEventListener('mouseenter', () => {
      image.src = row.dataset.image;
      preview.classList.add('is-on');
      active = true;
    });
    row.addEventListener('mouseleave', () => {
      preview.classList.remove('is-on');
      active = false;
    });
  });

  App.onTick(() => {
    const targetX = App.mouse.x, targetY = App.mouse.y;
    const speedX = targetX - x;                        // tilt cursor speed se
    x = lerp(x, targetX, 0.12);
    y = lerp(y, targetY, 0.12);
    const tilt = clamp(speedX * 0.15, -12, 12);
    const scale = active ? 1 : 0.8;
    const left = clamp(x + 30, 10, App.W - preview.offsetWidth - 10);
    preview.style.transform = `translate(${left}px, ${y - 110}px) rotate(${tilt}deg) scale(${scale})`;
  });
})();
