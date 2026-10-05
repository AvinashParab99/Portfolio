/* ============================================================================
   COUNTERS — [data-count] wale numbers screen par aate hi 0 se count-up hote hain.
     data-count="83"  data-suffix="%"  data-prefix="$"  data-decimals="2"
   ============================================================================ */

(function setupCounters() {
  function animate(el) {
    const target   = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);                 // ease-out
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  $$('[data-count]').forEach(el => observer.observe(el));
})();
