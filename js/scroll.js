/* ============================================================================
   SCROLL — smooth scrolling (Lenis), anchor links, reveal-on-scroll
   ============================================================================ */

(function setupScroll() {
  const lenis = new Lenis({ lerp: 0.075 });
  App.lenis = lenis;

  // Har frame: Lenis update + smoothed scroll velocity (effects isse bend/skew karte hain)
  App.onTick(time => {
    lenis.raf(time);
    const target = clamp((lenis.velocity || 0) / 30, -1.6, 1.6);
    App.velocity = lerp(App.velocity, target, 0.1);
  });

  // "#section" links par smooth scroll
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      event.preventDefault();
      App.closeMenu && App.closeMenu();
      lenis.scrollTo(id, { duration: 1.8 });
    });
  });

  // `.reveal` wale elements scroll par fade-up hote hain
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-in');
    });
  }, { threshold: 0.12 });

  $$('.reveal, .job, .cert').forEach(el => {
    if (el.classList.contains('job') || el.classList.contains('cert')) el.classList.add('reveal');
    observer.observe(el);
  });
})();
