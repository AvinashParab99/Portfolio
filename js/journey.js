/* ============================================================================
   JOURNEY — SVG path jo scroll ke saath draw hota hai, ek "traveler" dot us par
   chalta hai. Jis stop tak pahunche wo highlight hota hai; hover par us job ki
   skills + highlights khulte hain.
   ============================================================================ */

(function setupJourney() {
  const wrap     = $('#journeyWrap');
  const svg      = $('#journeySvg');
  const base     = $('.journey__base', svg);
  const progress = $('.journey__progress', svg);
  const nodesG   = $('.journey__nodes', svg);
  const traveler = $('.journey__traveler', svg);
  const jobs     = $$('.job');

  const SVG_NS = 'http://www.w3.org/2000/svg';
  let totalLength = 0;
  let stops = [];          // { length, circle, job }
  let current = 0;         // smoothed path position (px along path)

  /** Points ko smooth curve (Catmull-Rom -> Bezier) me jodta hai. */
  function smoothPath(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  function build() {
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    const narrow = App.W < 800;
    const centerX = narrow ? 16 : w / 2;
    const swing   = narrow ? 0 : Math.min(60, w * 0.04);

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    // path ke points: start -> har job ka stop -> end
    const stopPoints = jobs.map((job, i) => ({
      x: centerX + (i % 2 === 0 ? -swing : swing),
      y: job.offsetTop + 34
    }));
    const points = [{ x: centerX, y: 0 }, ...stopPoints, { x: centerX, y: h }];

    const d = smoothPath(points);
    base.setAttribute('d', d);
    progress.setAttribute('d', d);
    totalLength = progress.getTotalLength();
    progress.style.strokeDasharray = totalLength;

    // har stop path par kis length par hai (nearest point dhundho)
    nodesG.innerHTML = '';
    stops = stopPoints.map((pt, i) => {
      let best = 0, bestDist = Infinity;
      for (let len = 0; len <= totalLength; len += 4) {
        const p = progress.getPointAtLength(len);
        const dist = Math.hypot(p.x - pt.x, p.y - pt.y);
        if (dist < bestDist) { bestDist = dist; best = len; }
      }
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', pt.x);
      circle.setAttribute('cy', pt.y);
      circle.setAttribute('r', 9);
      circle.setAttribute('class', 'journey__node');
      nodesG.appendChild(circle);
      return { length: best, circle, job: jobs[i] };
    });
  }

  build();
  App.onResize(build);
  addEventListener('load', build);

  App.onTick(() => {
    const rect = wrap.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > App.H + 200) return;

    // viewport ke ~55% line par jitna path pahunch gaya
    const p = clamp((App.H * 0.55 - rect.top) / rect.height, 0, 1);
    current = lerp(current, p * totalLength, 0.1);

    progress.style.strokeDashoffset = totalLength - current;
    const point = progress.getPointAtLength(current);
    traveler.setAttribute('transform', `translate(${point.x}, ${point.y})`);

    // kaun se stops pass hue, kaun sa current hai
    let currentIndex = -1;
    stops.forEach((stop, i) => { if (stop.length <= current + 6) currentIndex = i; });
    stops.forEach((stop, i) => {
      stop.circle.classList.toggle('is-passed', i <= currentIndex);
      stop.job.classList.toggle('is-passed', i <= currentIndex);
      stop.job.classList.toggle('is-current', i === currentIndex);
    });
  });
})();
