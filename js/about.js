/* ============================================================================
   ABOUT — photo load (fallback ke saath) + halka 3D tilt / parallax
   ============================================================================ */

(function setupAbout() {
  const portrait = $('#portrait');
  const frame    = $('.portrait__frame');
  const image    = $('#portraitImg');

  // Photo: pehle profile.photo, na mile to photoFallback
  image.onerror = () => {
    image.onerror = null;
    image.src = CONFIG.profile.photoFallback;
  };
  image.src = CONFIG.profile.photo;

  // Portrait screen par aate hi photo neeche se khulti hai
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) frame.classList.add('is-in');
  }, { threshold: 0.2 }).observe(portrait);

  let tiltX = 0, tiltY = 0;

  App.onTick(() => {
    const rect = portrait.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > App.H) return;

    // mouse portrait ke kitna paas hai -> tilt
    const dx = clamp((App.mouse.x - (rect.left + rect.width / 2))  / App.W, -0.5, 0.5);
    const dy = clamp((App.mouse.y - (rect.top  + rect.height / 2)) / App.H, -0.5, 0.5);
    tiltX = lerp(tiltX, dx, 0.08);
    tiltY = lerp(tiltY, dy, 0.08);
    frame.style.transform = `rotateY(${tiltX * 14}deg) rotateX(${-tiltY * 10}deg)`;

    // andar ki photo scroll par halki chalti hai
    const shift = (rect.top - App.H / 2) * -0.06;
    image.style.transform = `translate3d(${tiltX * -14}px, ${shift}px, 0)`;
  });
})();
