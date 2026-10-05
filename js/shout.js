/* ============================================================================
   SHOUT OUTS — projects jaisa fold, lekin horizontal.
   Vertical scroll -> cards left ki taraf chalte hain aur left edge par fold hote hain.
   Sab cards ek hi size ke hain. Screenshot kisi bhi size ka ho, fit ho jaata hai.
   ============================================================================ */

(function setupShout() {
  const TEX_W = 840, TEX_H = 1000, PAD = 28;
  const fit = CONFIG.settings.shoutImageFit;

  const scroller = $('#shoutScroll');
  const track    = $('#shoutTrack');
  let trackWidth = 0;

  /** Card texture: screenshot (image) ya placeholder quote. */
  function drawCard(ctx, shout, image) {
    ctx.clearRect(0, 0, TEX_W, TEX_H);
    ctx.fillStyle = '#f8f5f3';
    roundedRect(ctx, 0, 0, TEX_W, TEX_H, 28);
    ctx.fill();

    if (image) {
      drawImageFit(ctx, image, PAD, PAD, TEX_W - PAD * 2, TEX_H - PAD * 2, fit);
      return;
    }

    ctx.fillStyle = '#ff4f1f';
    ctx.font = '300 150px Helvetica Neue, Arial';
    ctx.fillText('\u201C', 60, 190);

    ctx.fillStyle = '#1a1618';
    ctx.font = '300 50px Helvetica Neue, Arial';
    drawWrappedText(ctx, shout.quote, 60, 310, 720, 66);

    ctx.font = '500 32px Helvetica Neue, Arial';
    ctx.fillText(shout.name, 60, 880);
    ctx.fillStyle = '#8a8083';
    ctx.font = '300 28px Helvetica Neue, Arial';
    ctx.fillText(shout.role, 60, 925);
  }

  const cards = $$('.shout-card').map((element, i) => {
    const shout = CONFIG.shouts[i];

    const canvas = document.createElement('canvas');
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext('2d');
    drawCard(ctx, shout, null);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;

    App.loadImage(shout.image).then(image => {
      if (!image) return;
      drawCard(ctx, shout, image);
      texture.needsUpdate = true;
    });

    return { element, fold: GL.createFoldCard('x', texture) };
  });

  /** Section ki height = viewport + track ki extra lambai (taaki scroll horizontal ban jaaye). */
  function measure() {
    track.style.transform = 'none';
    trackWidth = track.scrollWidth;
    scroller.style.height = (App.H + Math.max(trackWidth - App.W, 0)) + 'px';
  }
  measure();
  App.onResize(measure);
  addEventListener('load', measure);

  App.onTick(() => {
    const rect = scroller.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(rect.height - App.H, 1), 0, 1);
    track.style.transform = `translate3d(${-progress * Math.max(trackWidth - App.W, 0)}px, 0, 0)`;

    const sectionOnScreen = rect.bottom > -50 && rect.top < App.H + 50;
    cards.forEach((c, i) => {
      if (!sectionOnScreen) { c.fold.mesh.visible = false; return; }
      GL.syncFoldCard(c.fold, c.element, 1 + (i % 2) * 0.15);
    });
  });
})();
