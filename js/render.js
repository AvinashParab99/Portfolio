/* ============================================================================
   RENDER — CONFIG ka data HTML me daalta hai.
   (Layout/structure badalna ho to yahan ke templates badlo.)
   ============================================================================ */

(function renderAll() {
  const { profile, social, skillCategories, education, experience,
          projects, certificates, shouts } = CONFIG;

  /* ---------- About + contact basics ---------- */
  $('#aboutBio').innerHTML = profile.bio;

  const mail = $('#contactMail');
  mail.href = `mailto:${profile.email}`;
  mail.textContent = profile.email;

  const phone = $('#contactPhone');
  phone.href = `tel:${profile.phone.replace(/[^+\d]/g, '')}`;
  phone.textContent = profile.phone;

  $('#contactLoc').textContent = profile.location;
  $('#menuMail').href = `mailto:${profile.email}`;
  $('#menuMail').textContent = profile.email;
  $('#menuLoc').textContent = profile.location;

  /* ---------- Menu links ---------- */
  const menuItems = [
    ['#about',     'About'],
    ['#skills',    'Skills'],
    ['#education', 'Education'],
    ['#journey',   'Work'],
    ['#projects',  'Projects'],
    ['#certs',     'Certificates'],
    ['#shout',     'Shout Outs'],
    ['#contact',   'Contact']
  ];
  $('#menuLinks').innerHTML = menuItems.map(([href, label], i) => `
    <a class="menu__link" href="${href}" style="--i:${i}">
      <i>0${i + 1}</i><span>${label}</span>
    </a>`).join('');

  /* ---------- Skills legend (chips skills.js banata hai) ---------- */
  const legend = [`<button class="is-on" data-cat="all">All</button>`]
    .concat(Object.entries(skillCategories).map(
      ([key, label]) => `<button data-cat="${key}">${label}</button>`));
  $('#skillLegend').innerHTML = legend.join('');

  /* ---------- Logo badge (image + fallback initials) ---------- */
  const logoBadge = item => `
    <div class="logo-badge" data-initials="${item.initials}" style="--c:${item.color}">
      <img src="${item.logo}" alt="" onerror="this.remove()">
    </div>`;

  /* ---------- Education ---------- */
  const capIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/><path d="M22 9v6"/>
    </svg>`;
  const RING = 2 * Math.PI * 52;                         // ring ki lambai (r = 52)

  $('#educationList').innerHTML = education.map(item => `
    <article class="edu reveal">
      <span class="edu__bg" aria-hidden="true">${String(item.end).slice(2)}</span>
      <div class="edu__main">
        <div class="edu__top">${logoBadge(item)}<span class="edu__icon">${capIcon}</span>
          <span class="edu__period">${item.start} — ${item.end}</span></div>
        <h3>${item.title}</h3>
        <b>${item.place}</b>
        <div class="edu__chips">${item.highlights.map(h => `<span>${h}</span>`).join('')}</div>
        <div class="edu__timeline">
          <span>${item.start}</span><div class="edu__track"><i></i></div><span>${item.end}</span>
        </div>
      </div>
      <div class="edu__score">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="edu__ring-bg" cx="60" cy="60" r="52"/>
          <circle class="edu__ring-fg" cx="60" cy="60" r="52"
                  style="stroke-dasharray:${RING}; --off:${RING * (1 - item.cgpa / item.cgpaMax)}"/>
        </svg>
        <div class="edu__num">
          <b data-count="${item.cgpa}" data-decimals="2">0</b><span>CGPA / ${item.cgpaMax}</span>
        </div>
      </div>
    </article>`).join('');

  /* ---------- Work journey (card + saamne ki side par year & stat) ---------- */
  $('#journeyList').innerHTML = experience.map((job, i) => {
    const year = (job.period.match(/\d{4}/) || [''])[0];
    return `
    <div class="journey__row ${i % 2 ? 'journey__row--flip' : ''}">
      <article class="job">
        <div class="job__head">
          ${logoBadge(job)}
          <div><span class="job__period">${job.period}</span>
               <p class="job__company">${job.company}</p></div>
        </div>
        <h3 class="job__role">${job.role}</h3>
        <p class="job__summary">${job.summary}</p>
        <div class="job__more">
          <div class="job__label">Skills used</div>
          <div class="job__chips">${job.skills.map(s => `<span>${s}</span>`).join('')}</div>
          <div class="job__label">Highlights</div>
          <ul class="job__wins">${job.wins.map(w => `<li>${w}</li>`).join('')}</ul>
        </div>
      </article>
      <div class="job__aside reveal">
        <span class="job__year" aria-hidden="true">${year}</span>
        <div class="job__stat">
          <b data-count="${job.stat.value}" data-suffix="${job.stat.suffix || ''}">0</b>
          <span>${job.stat.label}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  /* ---------- Projects + filters ---------- */
  const categories = [...new Set(projects.map(p => p.category))];
  const filterButtons = [`<button class="is-on" data-filter="all">All<sup>${projects.length}</sup></button>`]
    .concat(categories.map(cat => {
      const count = projects.filter(p => p.category === cat).length;
      return `<button data-filter="${cat}">${cat}<sup>${count}</sup></button>`;
    }));
  $('#projectFilters').innerHTML = filterButtons.join('');

  $('#projectGrid').innerHTML = projects.map(p => `
    <article class="card" data-category="${p.category}">
      <div class="card__image"></div>
      <div class="card__caption"><b>${p.title}</b><span>${p.subtitle}</span><i>↘</i></div>
    </article>`).join('');

  /* ---------- Certificates ---------- */
  $('#certList').innerHTML = certificates.map(c => `
    <a class="cert reveal" data-image="${c.image}">
      <span class="cert__title">${c.title}</span>
      <em>${c.issuer}</em>
      <i>${c.year}</i>
    </a>`).join('');

  /* ---------- Shout-out cards ---------- */
  $('#shoutTrack').innerHTML = shouts.map(() => `<article class="shout-card"></article>`).join('');

  /* ---------- Social links ---------- */
  const socialRows = [
    { key: 'linkedin', label: 'LinkedIn', href: social.linkedin,                              extra: '↗' },
    { key: 'github',   label: 'GitHub',   href: `https://github.com/${social.github}`,         extra: '↗' },
    { key: 'leetcode', label: 'LeetCode', href: `https://leetcode.com/u/${social.leetcode}`,   extra: '↗' },
    { key: 'resume',   label: 'Resume',   href: profile.resume,                                extra: '↓ Download' }
  ];
  $('#socialLinks').innerHTML = socialRows.map(r => `
    <a class="social-link" data-preview="${r.key}" href="${r.href}"
       ${r.key === 'resume' ? 'download' : 'target="_blank" rel="noopener"'}>
      <span>${r.label}</span><i>${r.extra}</i>
    </a>`).join('');
})();
