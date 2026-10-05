/* ============================================================================
   PROJECTS — card ka image + caption ek canvas texture me banta hai, WebGL me
   screen ke upar edge par fold hota hai (webgl.js). Filter buttons yahan hain.
   Card ka size fixed hai; tumhari image kisi bhi size ki ho, auto fit hogi.
   ============================================================================ */

(function setupProjects() {
  const TEX_W = 1000, TEX_H = 755, IMG_H = 645;      // card ka texture ratio (CSS aspect-ratio se match)
  const fit = CONFIG.settings.projectImageFit;

  /** Ek project ka poora card (image + caption) canvas par draw karo. */
  function drawCard(ctx, project, index, image) {
    ctx.clearRect(0, 0, TEX_W, TEX_H);

    if (image) {
      drawImageFit(ctx, image, 0, 0, TEX_W, IMG_H, fit);
    } else {
      // image nahi mili: gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, TEX_W, IMG_H);
      gradient.addColorStop(0, project.colors[0]);
      gradient.addColorStop(1, project.colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, TEX_W, IMG_H);

      ctx.fillStyle = '#fff';
      ctx.font = '300 90px Helvetica Neue, Arial';
      ctx.fillText(project.title, 50, 590);
      ctx.font = '20px Helvetica';
      ctx.fillText('0' + (index + 1), 50, 64);
    }

    // caption (image ke neeche)
    ctx.fillStyle = '#111';
    ctx.font = '700 30px Helvetica';
    ctx.fillText(project.title, 4, 690);
    ctx.font = '400 30px Helvetica';
    ctx.fillText(project.subtitle, 4, 732);
    ctx.textAlign = 'right';
    ctx.fillText('↘', 996, 732);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.fillRect(0, 748, TEX_W, 2);
  }

  const elements = $$('.card');

  const cards = elements.map((element, i) => {
    const project = CONFIG.projects[i];

    const canvas = document.createElement('canvas');
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext('2d');
    drawCard(ctx, project, i, null);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    // image baad me load hoti hai -> mil gayi to texture update
    App.loadImage(project.image).then(image => {
      if (!image) return;
      drawCard(ctx, project, i, image);
      texture.needsUpdate = true;
    });

    return { element, fold: GL.createFoldCard('y', texture) };
  });

  /* ---------- filters ---------- */
  $('#projectFilters').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    $$('#projectFilters button').forEach(b => b.classList.toggle('is-on', b === button));
    const filter = button.dataset.filter;
    cards.forEach(c => {
      c.element.hidden = filter !== 'all' && c.element.dataset.category !== filter;
    });
  });

  /* ---------- har frame DOM rect se sync ---------- */
  App.onTick(() => {
    cards.forEach((c, i) => GL.syncFoldCard(c.fold, c.element, 1 + (i % 2) * 0.18));
  });
})();
