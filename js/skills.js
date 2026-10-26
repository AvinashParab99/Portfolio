/* ============================================================================
   SKILLS — floating chips (mini physics):
     - chips dheere tairte hain, walls se takrate hain, ek dusre se door hote hain
     - cursor paas aaye to chips door bhaagte hain
     - upar ke buttons category filter karte hain
   ============================================================================ */

(function setupSkills() {
  const field  = $('#skillField');
  const legend = $('#skillLegend');

  /* ---------- chips banao ---------- */
  const chips = CONFIG.skills.map(skill => {
    const el = document.createElement('div');
    el.className = 'skill-chip';
    el.dataset.cat = skill.cat;
    el.dataset.name = skill.name;                      // hover tooltip ke liye

    if (skill.logo) {
      // logo diya hai -> naam ki jagah logo dikhao
      el.classList.add('has-logo');
      el.innerHTML = `<span><img src="${skill.logo}" alt="${skill.name}" width="30" height="30"></span>`;

      // logo load na ho to wapas naam dikha do
      el.querySelector('img').onerror = () => {
        el.classList.remove('has-logo');
        el.innerHTML = `<span>${skill.name}</span>`;
        measure();
      };
    } else {
      el.innerHTML = `<span>${skill.name}</span>`;
    }
    field.appendChild(el);
    return { el, cat: skill.cat, x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0 };
  });

  function measure() {
    chips.forEach(c => { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; });
  }

  function scatter() {
    measure();
    const W = field.clientWidth, H = field.clientHeight;
    chips.forEach(c => {
      c.x = Math.random() * Math.max(W - c.w, 1);
      c.y = Math.random() * Math.max(H - c.h, 1);
      const angle = Math.random() * Math.PI * 2;
      c.vx = Math.cos(angle) * 0.35;
      c.vy = Math.sin(angle) * 0.35;
    });
  }
  scatter();
  App.onResize(scatter);

  /* ---------- filter buttons ---------- */
  legend.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    $$('button', legend).forEach(b => b.classList.toggle('is-on', b === button));
    const cat = button.dataset.cat;
    chips.forEach(c => c.el.classList.toggle('is-dim', cat !== 'all' && c.cat !== cat));
  });

  /* ---------- physics (sirf tab jab section screen par ho) ---------- */
  let visible = false;
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(field);

  const MOUSE_RADIUS = 150;

  App.onTick(() => {
    if (!visible) return;
    const W = field.clientWidth, H = field.clientHeight;
    const box = field.getBoundingClientRect();
    const mx = App.mouse.x - box.left, my = App.mouse.y - box.top;

    chips.forEach(c => {
      // cursor se door bhaago
      const cx = c.x + c.w / 2 - mx, cy = c.y + c.h / 2 - my;
      const d = Math.hypot(cx, cy);
      if (d < MOUSE_RADIUS && d > 0) {
        const force = (1 - d / MOUSE_RADIUS) * 0.9;
        c.vx += (cx / d) * force;
        c.vy += (cy / d) * force;
      }

      // thoda friction, lekin kabhi rukna nahi
      c.vx *= 0.985; c.vy *= 0.985;
      const speed = Math.hypot(c.vx, c.vy);
      if (speed < 0.28) { c.vx *= 1.04; c.vy *= 1.04; }
      if (speed > 6)    { c.vx *= 0.9;  c.vy *= 0.9;  }

      c.x += c.vx; c.y += c.vy;

      // walls se bounce
      if (c.x < 0)           { c.x = 0;           c.vx =  Math.abs(c.vx); }
      if (c.x > W - c.w)     { c.x = W - c.w;     c.vx = -Math.abs(c.vx); }
      if (c.y < 0)           { c.y = 0;           c.vy =  Math.abs(c.vy); }
      if (c.y > H - c.h)     { c.y = H - c.h;     c.vy = -Math.abs(c.vy); }
    });
    

    // chips ek dusre par chadhe nahi (rectangle overlap -> halka dhakka)
    for (let i = 0; i < chips.length; i++) {
      for (let j = i + 1; j < chips.length; j++) {
        const a = chips[i], b = chips[j];
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) {
          const push = ox / 2 * (a.x < b.x ? -1 : 1);
          a.x += push; b.x -= push; [a.vx, b.vx] = [b.vx, a.vx];
        } else {
          const push = oy / 2 * (a.y < b.y ? -1 : 1);
          a.y += push; b.y -= push; [a.vy, b.vy] = [b.vy, a.vy];
        }
      }
    }

    chips.forEach(c => {
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
    });
  });
})();
