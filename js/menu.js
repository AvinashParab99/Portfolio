/* ============================================================================
   MENU — right se left slide hone wala half-width menu + active section
   ============================================================================ */

(function setupMenu() {
  const button = $('#menuBtn');
  const label  = $('.menu-btn__label');
  const menu   = $('#menu');
  const links  = $$('.menu__link');

  function open() {
    document.body.classList.add('is-menu-open');
    button.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    label.textContent = 'Close';
    App.lenis && App.lenis.stop();
  }

  function close() {
    document.body.classList.remove('is-menu-open');
    button.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    label.textContent = 'Menu';
    App.lenis && App.lenis.start();
  }

  App.closeMenu = close;

  button.addEventListener('click', () => {
    document.body.classList.contains('is-menu-open') ? close() : open();
  });
  $('.menu__veil').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Jis section me ho, menu me uska link highlight hota hai
  const sections = links.map(l => $(l.getAttribute('href')));
  App.onTick(() => {
    const mid = App.H * 0.45;
    let current = 0;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= mid) current = i;
    });
    links.forEach((l, i) => l.classList.toggle('is-active', i === current));
  });
})();
