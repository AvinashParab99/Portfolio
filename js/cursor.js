/* ============================================================================
   CURSOR — custom ring cursor; kuch elements par bada hokar label dikhata hai
   ============================================================================ */

(function setupCursor() {
  const cursor = $('#cursor');
  let x = 0, y = 0;

  // selector -> label ('' = sirf bada circle)
  const targets = [
    ['.card',        'View'],
    ['.contact__mail', 'Email'],
    ['.social-link', 'Open'],
    ['.job',         '']
  ];

  document.addEventListener('mouseover', event => {
    const hit = targets.find(([selector]) => event.target.closest(selector));
    if (!hit) {
      cursor.classList.remove('is-big');
      cursor.textContent = '';
      return;
    }
    cursor.classList.add('is-big');
    const isResume = event.target.closest('[data-preview="resume"]');
    cursor.textContent = isResume ? 'Download' : hit[1];
  });

  App.onTick(() => {
    x = lerp(x, App.mouse.x, 0.18);
    y = lerp(y, App.mouse.y, 0.18);
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  });
})();
