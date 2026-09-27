import { fitCanvas, rng } from './art.js';
import { lang, t } from './i18n.js';

/* ==================================================================
   04 · La reputación: rating and monthly reviews before and after the strategy
   ================================================================== */
const MOMENTS = {
  es: [
  { rating: 3.5, reviews: 200, label: 'Antes de la estrategia',
    copy: 'Tras el pico de demanda, la calificación promedio de la red cayó de 4.2 a 3.5 estrellas. Llegaban unas 200 reseñas al mes.' },
  { rating: 4.7, reviews: 3000, label: 'Después de la estrategia',
    copy: 'Con tarjetas NFC y códigos QR en los puntos de venta, las reseñas pasaron de unas 200 a más de 3,000 al mes y la calificación subió a 4.7 estrellas.' },
],
  en: [
  { rating: 3.5, reviews: 200, label: 'Before the strategy',
    copy: "After the demand spike, the network's average rating fell from 4.2 to 3.5 stars. About 200 reviews came in each month." },
  { rating: 4.7, reviews: 3000, label: 'After the strategy',
    copy: 'With NFC cards and QR codes at the points of sale, reviews went from about 200 to more than 3,000 a month and the rating rose to 4.7 stars.' },
  ],
}[lang];
const A11Y = {
  es: { stars: 'estrellas', perMonth: 'reseñas al mes', none: 'sin dato de reseñas' },
  en: { stars: 'stars', perMonth: 'reviews a month', none: 'no review data' },
}[lang];
const PER_DOT = 10;
const COLS = 30, ROWS = 10; // 300 dots = 3,000 reviews

function starPath(ctx, cx, cy, R) {
  ctx.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const r = k % 2 ? R * 0.45 : R;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
}

export function initLearning(root, { isMotion }) {
  const canvas = root.querySelector('[data-plate]');
  const view = fitCanvas(canvas);
  const ratingEl = root.querySelector('[data-acc]');
  const reviewsEl = root.querySelector('[data-steps]');
  const statusEl = root.querySelector('[data-learn-status]');
  const tabs = [...root.querySelectorAll('[data-moment]')];
  const shown = { rating: 3.5, dots: 20 };
  let target = 1, raf = 0;

  const fmt = (n) => (n == null ? '—' : n >= 3000 ? '3,000+' : n.toLocaleString(t.locale));

  function draw() {
    const { ctx, w, h } = view;
    ctx.fillStyle = '#234ae8';
    ctx.fillRect(0, 0, w, h);
    // five stars, filled up to the current rating
    const R = Math.min(h * 0.11, w * 0.045);
    const gap = R * 2.5, x0 = w / 2 - gap * 2, y0 = h * 0.2;
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(242,244,241,0.55)';
    for (let k = 0; k < 5; k++) { starPath(ctx, x0 + k * gap, y0, R); ctx.stroke(); }
    // clip to the rating: full stars plus a fraction of the next
    ctx.save();
    ctx.beginPath();
    const full = Math.floor(shown.rating), frac = shown.rating - full;
    for (let k = 0; k < 5; k++) {
      const cx = x0 + k * gap;
      if (k < full) ctx.rect(cx - R, y0 - R, 2 * R, 2 * R);
      else if (k === full) ctx.rect(cx - R, y0 - R, 2 * R * frac, 2 * R);
    }
    ctx.clip();
    ctx.fillStyle = '#f2f4f1';
    for (let k = 0; k < 5; k++) { starPath(ctx, x0 + k * gap, y0, R); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = '#f2f4f1';
    ctx.font = `500 ${Math.round(R * 1.1)}px Raleway, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(shown.rating.toFixed(1), w / 2, y0 + R * 2.1);
    // dots: each one is about 10 monthly reviews
    const top = h * 0.46, bottom = h * 0.93, left = w * 0.06, right = w * 0.94;
    const dx = (right - left) / (COLS - 1), dy = (bottom - top) / (ROWS - 1);
    const r = Math.max(2, Math.min(dx, dy) * 0.24);
    for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
      const k = j * COLS + i;
      const on = Math.max(0, Math.min(1, shown.dots - k));
      ctx.beginPath();
      ctx.arc(left + i * dx, top + j * dy, r, 0, Math.PI * 2);
      if (on > 0) { ctx.fillStyle = `rgba(242,244,241,${0.25 + 0.75 * on})`; ctx.fill(); }
      else { ctx.strokeStyle = 'rgba(242,244,241,0.18)'; ctx.lineWidth = 1; ctx.stroke(); }
    }
  }

  function set(i, animate) {
    target = i;
    const m = MOMENTS[i];
    tabs.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.moment) === i)));
    ratingEl.textContent = m.rating.toFixed(1);
    reviewsEl.textContent = fmt(m.reviews);
    statusEl.textContent = m.copy;
    canvas.setAttribute('aria-label', `${m.label}: ${m.rating.toFixed(1)} ${A11Y.stars}, ${m.reviews ? `${fmt(m.reviews).toLowerCase()} ${A11Y.perMonth}` : A11Y.none}`);
    const goal = { rating: m.rating, dots: (m.reviews || 0) / PER_DOT };
    cancelAnimationFrame(raf);
    if (!animate || !isMotion()) { Object.assign(shown, goal); draw(); return; }
    const tick = () => {
      shown.rating += (goal.rating - shown.rating) * 0.08;
      shown.dots += (goal.dots - shown.dots) * 0.045;
      const done = Math.abs(goal.rating - shown.rating) < 0.005 && Math.abs(goal.dots - shown.dots) < 0.2;
      if (done) Object.assign(shown, goal);
      draw();
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.moment) set(Number(b.dataset.moment), true);
    else if ('run' in b.dataset) set(1, true);
    else if ('learnReset' in b.dataset) set(0, true);
  });

  new ResizeObserver(() => draw()).observe(canvas);
  set(0, false);
}
