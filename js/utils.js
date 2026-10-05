/* ============================================================================
   UTILS — chhote helpers + shared `App` object (sab files isse baat karti hain)
   ============================================================================ */

const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/** Shared state + tiny event system. */
const App = {
  W: innerWidth,
  H: innerHeight,
  time: 0,                                   // seconds
  velocity: 0,                               // smoothed scroll velocity (-1.6 .. 1.6)
  mouse: { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 },   // nx, ny: -1 .. 1

  _tickers: [],
  _resizers: [],
  onTick(fn)   { this._tickers.push(fn); },  // fn(timeMs) har frame chalega
  onResize(fn) { this._resizers.push(fn); }, // fn() resize par chalega

  /** Image load karo; fail hone par null deta hai (crash nahi). */
  loadImage(src) {
    return new Promise(resolve => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
};

addEventListener('mousemove', e => {
  App.mouse.x  = e.clientX;
  App.mouse.y  = e.clientY;
  App.mouse.nx = (e.clientX / App.W) * 2 - 1;
  App.mouse.ny = (e.clientY / App.H) * 2 - 1;
});

addEventListener('resize', () => {
  App.W = innerWidth;
  App.H = innerHeight;
  App._resizers.forEach(fn => fn());
});

/* ---------- canvas helpers (card textures) ---------- */

/**
 * Image ko box (x, y, w, h) me fit karo.
 *  mode 'cover'   -> box poora bharta hai (extra crop hota hai)
 *  mode 'contain' -> poori image dikhti hai (khali jagah rah sakti hai)
 */
function drawImageFit(ctx, img, x, y, w, h, mode = 'cover') {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  const fitHeight = (mode === 'cover') ? imgRatio > boxRatio : imgRatio <= boxRatio;
  const dh = fitHeight ? h : w / imgRatio;
  const dw = fitHeight ? h * imgRatio : w;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

/** Text ko maxWidth par wrap karke draw karta hai. */
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  text.split(' ').forEach(word => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, y);
}

/** Rounded rectangle path (purane browsers ke liye safe). */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
