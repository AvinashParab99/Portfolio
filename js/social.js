/* ============================================================================
   SOCIAL — LinkedIn / GitHub / LeetCode / Resume par hover karo to preview card.
     GitHub   -> daily activity heatmap (live data, username CONFIG.social.github)
     LeetCode -> solved + easy/medium/hard bars (live, username CONFIG.social.leetcode)
     Resume   -> PDF preview; click par download
   Live data na mile (ya username placeholder ho) to sample data + "(sample)" dikhta hai.
   ============================================================================ */

(function setupSocial() {
  const { social, profile } = CONFIG;
  const preview = $('#socialPreview');
  let x = 0, y = 0;

  const HEAT_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

  /* ---------- panel ka HTML ---------- */
  function panelHTML(kind) {
    if (kind === 'linkedin') return `
      <div class="pt"><div class="av">AP</div>
        <div><b>${profile.name}</b><span>Python Developer · Automation &amp; Data</span></div></div>
      <div class="pb">${profile.location}<br>Numerator · ex-Baroda Global · ex-TCS</div>
      <div class="ft"><span>LinkedIn</span><span>Open profile ↗</span></div>`;

    if (kind === 'github') return `
      <div class="pt"><div class="av">GH</div>
        <div><b>${social.github}</b><span id="ghSummary">Contributions in the last year (sample)</span></div></div>
      <div class="pb"><canvas id="ghHeat" width="640" height="96"></canvas></div>
      <div class="ft"><span>Daily activity</span><span>Open GitHub ↗</span></div>`;

    if (kind === 'leetcode') {
      const bars = [['Easy', '#00b8a3', 'lcEasy'], ['Medium', '#ffb800', 'lcMedium'], ['Hard', '#ef4743', 'lcHard']]
        .map(([name, color, id]) => `
          <div class="bar-row">${name}
            <div class="bar"><i id="${id}" style="background:${color}"></i></div>
          </div>`).join('');
      return `
      <div class="pt"><div class="av">LC</div>
        <div><b>${social.leetcode}</b><span id="lcSummary">275+ solved (sample)</span></div></div>
      <div class="pb"><b class="big-num" id="lcTotal">275</b> solved${bars}</div>
      <div class="ft"><span>LeetCode</span><span>Open profile ↗</span></div>`;
    }

    // resume
    return `
      <img src="assets/resume-preview.png" alt="Resume preview">
      <div class="ft"><span>Resume.pdf</span><span>Click to download ↓</span></div>`;
  }

  /* ---------- GitHub heatmap ---------- */
  function drawHeatmap(canvas, levels) {
    const ctx = canvas.getContext('2d');
    const cell = canvas.width / 53;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let i = 0;
    for (let col = 0; col < 53; col++) {
      for (let row = 0; row < 7; row++) {
        ctx.fillStyle = HEAT_COLORS[levels[i++] || 0];
        ctx.fillRect(col * cell + 1, row * cell + 1, cell - 2, cell - 2);
      }
    }
  }

  function sampleLevels() {                       // fake-but-stable pattern
    let seed = 7;
    return Array.from({ length: 371 }, (_, i) => {
      seed = (seed * 9301 + 49297) % 233280;
      const r = seed / 233280;
      const weekend = i % 7 === 0 || i % 7 === 6;
      if (weekend) return r > 0.8 ? 1 : 0;
      return r > 0.82 ? 3 : r > 0.6 ? 2 : r > 0.35 ? 1 : 0;
    });
  }

  function loadGithub() {
    const canvas = $('#ghHeat');
    drawHeatmap(canvas, sampleLevels());
    fetch(`https://github-contributions-api.jogruber.de/v4/${social.github}?y=last`)
      .then(r => r.json())
      .then(data => {
        if (!data.contributions) return;
        drawHeatmap(canvas, data.contributions.map(c => c.level));
        $('#ghSummary').textContent = `${data.total.lastYear || ''} contributions in the last year`;
      })
      .catch(() => {});
  }

  /* ---------- LeetCode stats ---------- */
  function loadLeetcode() {
    const setBars = (easy, medium, hard, total) => {
      $('#lcTotal').textContent = total;
      $('#lcEasy').style.width   = easy + '%';
      $('#lcMedium').style.width = medium + '%';
      $('#lcHard').style.width   = hard + '%';
    };
    setBars(55, 40, 12, 275);                     // sample
    fetch(`https://leetcode-stats-api.herokuapp.com/${social.leetcode}`)
      .then(r => r.json())
      .then(d => {
        if (d.status !== 'success') return;
        setBars(d.easySolved / d.totalEasy * 100, d.mediumSolved / d.totalMedium * 100,
                d.hardSolved / d.totalHard * 100, d.totalSolved);
        $('#lcSummary').textContent = `${d.totalSolved} solved · rank ${d.ranking}`;
      })
      .catch(() => {});
  }

  /* ---------- hover show / hide ---------- */
  $$('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const kind = link.dataset.preview;
      preview.innerHTML = panelHTML(kind);
      if (kind === 'github')   loadGithub();
      if (kind === 'leetcode') loadLeetcode();
      preview.classList.add('is-on');
    });
    link.addEventListener('mouseleave', () => preview.classList.remove('is-on'));
  });

  App.onTick(() => {
    x = lerp(x, App.mouse.x, 0.14);
    y = lerp(y, App.mouse.y, 0.14);
    const left = clamp(x + 36, 10, App.W - 360);
    const top  = clamp(y - 120, 70, App.H - preview.offsetHeight - 20);
    preview.style.transform = `translate(${left}px, ${top}px)`;
  });
})();
