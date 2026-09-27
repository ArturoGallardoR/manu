import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/400-italic.css';
import '@fontsource/raleway/100.css';
import '@fontsource/raleway/200.css';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/500.css';
import '@fontsource/space-mono/400.css';
import 'lenis/dist/lenis.css';
import './styles.css';

import Lenis from 'lenis';
import { exhibitionHTML, chapters, companyNames } from './content.js';
import { t, lang, setLang, applyStatic } from './i18n.js';
import {
  fitCanvas, loopWhenVisible, createAnamorph, drawScale,
  createChrome, createBalloons, createMarionette, makePosters, rng, DPR,
} from './art.js';
import { initLearning } from './labs.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const EASE = 'cubic-bezier(.22, 1, .36, 1)';
const FONT = '"Inter Tight", "Helvetica Neue", Arial, sans-serif';

const html = document.documentElement;
const exhibition = $('[data-exhibition]');
exhibition.innerHTML = exhibitionHTML;
applyStatic();
$('[data-footer-cases]').innerHTML = chapters.slice(1, 7).map((c) => `<a href="#${c.id}">${c.name}</a>`).join('');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motion = !reduced;
const isMotion = () => motion;
exhibition.dataset.exhibitionMotion = String(motion);

/* ------------------------------------------------------------------
   Smooth scroll — Lenis (https://github.com/darkroomengineering/lenis#readme)
   ------------------------------------------------------------------ */
const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });

/* ------------------------------------------------------------------
   Chrome: header/footer modes, progress hair, chapter counter
   ------------------------------------------------------------------ */
const hair = $('.hair');
const foot = $('.foot');
const footer = $('.footer');
const currentEl = $('[data-current]');
const indexBars = $$('.indexIcon i');
const chapterEls = $$('.chapter');

function surfaceAt(y) {
  for (const el of document.elementsFromPoint(8, y)) {
    if (el.closest('.header, .foot, .hair, dialog')) continue;
    const s = el.closest('[data-surface]');
    if (s) return s.dataset.surface;
  }
  return 'paper';
}

let activeChapter = -1;
function updateChrome() {
  const vh = innerHeight;
  const header = surfaceAt(42);
  if (html.dataset.headerMode !== header) html.dataset.headerMode = header;
  const footMode = surfaceAt(vh - 24);
  if (html.dataset.footerMode !== footMode) html.dataset.footerMode = footMode;

  const first = chapterEls[0].getBoundingClientRect();
  const last = chapterEls[chapterEls.length - 1].getBoundingClientRect();
  const span = last.bottom - first.top - vh;
  const p = clamp(-first.top / span);
  hair.style.width = `${(p * 100).toFixed(3)}%`;

  let idx = 0;
  chapterEls.forEach((c, i) => { if (c.getBoundingClientRect().top <= vh * 0.5) idx = i; });
  if (idx !== activeChapter) {
    activeChapter = idx;
    currentEl.textContent = chapters[idx].n;
    html.dataset.activeChapter = chapters[idx].id;
    indexBars.forEach((b, i) => (b.dataset.active = String(i === idx)));
    $$('.rail a').forEach((a, i) => a.setAttribute('aria-current', String(i === idx)));
  }
  foot.classList.toggle('is-hidden', footer.getBoundingClientRect().top < vh - 10);
}

/* ------------------------------------------------------------------
   Reveal — [data-reveal]: fade + 12px rise, .7s ease-out-3
   ------------------------------------------------------------------ */
const revealIO = new IntersectionObserver((entries) => {
  const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
  batch.forEach((el, i) => {
    revealIO.unobserve(el);
    if (!motion) { el.removeAttribute('data-reveal'); return; }
    const a = el.animate(
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: i * 80, easing: EASE, fill: 'forwards' },
    );
    a.onfinish = () => { el.removeAttribute('data-reveal'); a.cancel(); };
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
$$('[data-reveal]').forEach((el) => (reduced ? el.removeAttribute('data-reveal') : revealIO.observe(el)));

/* ------------------------------------------------------------------
   Scroll-scrubbed pins
   ------------------------------------------------------------------ */
const trackProgress = (el) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - innerHeight));
};

// Prologue: two-line statements roll through a clipped drum window
const prologue = $('[data-prologue]');
const drumLines = $$('.drumLine', prologue);
function updatePrologue() {
  const p = motion ? trackProgress(prologue) : 1;
  const s = clamp(p * 1.12 - 0.04) * 2; // 0..2 across the three statements
  const k = Math.min(1, Math.floor(s));
  const frac = s - k;
  const c = 2 * (k + smooth(clamp((frac - 0.28) / 0.44))) + (s >= 2 ? 0 : 0);
  const lh = prologue.querySelector('.prologueCopy').getBoundingClientRect().height / 2.05;
  drumLines.forEach((el, j) => {
    const d = j - c; // 0 and 1 = current statement
    let y = d * lh, rot = 0, op = 1, sy = 1, tone = 0;
    if (d < 0) { // outgoing: tilts back and ghosts
      rot = clamp(-d, 0, 1.4) * 58; sy = 1 - clamp(-d) * 0.25; op = clamp(1 + d * 0.75, 0, 1) * 0.55; tone = 1;
      y = d * lh * 0.62;
    } else if (d >= 2) { // incoming, clipped by the window's bottom edge
      tone = clamp(d - 1.6); op = 1 - 0.45 * tone;
    }
    el.style.transform = `translateY(${y.toFixed(1)}px) rotateX(${rot.toFixed(1)}deg) scaleY(${sy.toFixed(3)})`;
    const ref = el.firstElementChild; // chapter appendix: only for the statement in view
    if (ref) ref.style.opacity = clamp(1 - Math.abs(d) * 2.5).toFixed(3);
    el.style.opacity = op.toFixed(3);
    el.style.filter = tone ? `saturate(${1 - tone * 0.5})` : '';
    el.style.color = tone && !el.classList.contains('is-accent') ? `color-mix(in srgb, #202623 ${Math.round(100 - tone * 55)}%, #f2f4f1)` : '';
    if (el.classList.contains('is-accent')) el.style.color = tone ? `color-mix(in srgb, #234ae8 ${Math.round(100 - tone * 60)}%, #f2f4f1)` : '';
  });
}

// Promise: the title explodes into fine particles thrown in every direction.
// The word is rasterised once; every grid cell touching ink becomes a particle and is erased
// from the bitmap the moment it launches, so no outline of the letters is left behind.
const ruptureTrack = $('[data-rupture]');
const rupture = $('.rupture', ruptureTrack);
const wordEl = $('.fractureWhole', rupture);
const sporeCanvas = $('.fractureSpores', rupture);
const sporeCtx = sporeCanvas.getContext('2d');
const promiseState = $('[data-promise-state]');
const spores = { list: [], text: null, color: '#fff', d: 1, key: '', f: -1 };
const BLAST = 0.6; // share of the scrub each particle spends in flight
function buildSpores() {
  const cr = sporeCanvas.getBoundingClientRect(), wr = wordEl.getBoundingClientRect();
  const key = `${Math.round(cr.width)}x${Math.round(cr.height)}:${document.fonts.status}`;
  if (key === spores.key) return;
  spores.key = key;
  const d = (spores.d = Math.min(DPR(), 1.25));
  sporeCanvas.width = Math.round(cr.width * d);
  sporeCanvas.height = Math.round(cr.height * d);
  const cs = getComputedStyle(wordEl);
  const fs = parseFloat(cs.fontSize), word = wordEl.textContent;
  spores.color = cs.color;
  const t = document.createElement('canvas');
  t.width = sporeCanvas.width; t.height = sporeCanvas.height;
  const x = t.getContext('2d', { willReadFrequently: true });
  x.setTransform(d, 0, 0, d, 0, 0);
  x.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  if ('letterSpacing' in x && cs.letterSpacing !== 'normal') x.letterSpacing = cs.letterSpacing;
  x.fillStyle = cs.color;
  const mt = x.measureText(word);
  const asc = mt.fontBoundingBoxAscent ?? fs * 0.8, desc = mt.fontBoundingBoxDescent ?? fs * 0.2;
  const lh = parseFloat(cs.lineHeight) || fs;
  const ox = wr.left - cr.left, base = wr.top - cr.top + (lh - asc - desc) / 2 + asc;
  x.fillText(word, ox, base);
  spores.text = t;
  const S = Math.max(3, Math.round(fs / 70));
  const W = t.width, H = t.height, data = x.getImageData(0, 0, W, H).data;
  const cx0 = ox + mt.width / 2, cy0 = base - asc / 2, reach = Math.hypot(mt.width / 2, asc);
  const r = rng(7), list = [];
  for (let y = base - asc - S; y < base + desc + S; y += S) {
    for (let xx = ox - S; xx < ox + mt.width + S; xx += S) {
      const ex = Math.max(0, Math.floor(xx * d)), ey = Math.max(0, Math.floor(y * d));
      const ex1 = Math.min(W, Math.ceil((xx + S) * d)), ey1 = Math.min(H, Math.ceil((y + S) * d));
      let ink = false;
      for (let py = ey; py < ey1 && !ink; py++) for (let px = ex; px < ex1; px++) if (data[(py * W + px) * 4 + 3] > 4) { ink = true; break; }
      if (!ink) continue;
      const px = xx + S / 2, py = y + S / 2;
      const ang = Math.atan2(py - cy0, px - cx0) + (r() - 0.5) * 2.6;
      const speed = fs * (0.35 + r() ** 2 * 2.8);
      list.push({ x: px, y: py, ex, ey, ew: ex1 - ex, eh: ey1 - ey,
        del: (Math.hypot(px - cx0, py - cy0) / reach) * 0.22 + r() * 0.1,
        vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, sz: 0.9 + r() * 1.3 });
    }
  }
  spores.list = list;
}
function drawSpores(f) {
  spores.f = f;
  if (f <= 0.001) return;
  buildSpores();
  const { d, list } = spores, c = sporeCtx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-over';
  c.globalAlpha = 1;
  c.clearRect(0, 0, sporeCanvas.width, sporeCanvas.height);
  c.drawImage(spores.text, 0, 0);
  c.globalCompositeOperation = 'destination-out';
  c.beginPath();
  for (const p of list) if (f > p.del) c.rect(p.ex, p.ey, p.ew, p.eh);
  c.fill();
  c.globalCompositeOperation = 'source-over';
  c.setTransform(d, 0, 0, d, 0, 0);
  c.fillStyle = spores.color;
  for (const p of list) {
    const q = (f - p.del) / BLAST;
    if (q <= 0 || q >= 1) continue;
    const k = 1 - (1 - q) ** 3; // fast burst, then drag
    const s = p.sz * (1 - q * 0.45);
    c.globalAlpha = q < 0.55 ? 1 : 1 - (q - 0.55) / 0.45;
    c.fillRect(p.x + p.vx * k - s / 2, p.y + p.vy * k - s / 2, s, s);
  }
  c.globalAlpha = 1;
}
new ResizeObserver(() => { spores.key = ''; drawSpores(spores.f); }).observe(sporeCanvas);
document.fonts.ready.then(() => { spores.key = ''; drawSpores(spores.f); });
function updateRupture() {
  const p = motion ? trackProgress(ruptureTrack) : 0;
  rupture.style.setProperty('--promise-progress', p.toFixed(4));
  // the gradient rises as the stage enters from below and settles just after it pins
  const top = ruptureTrack.getBoundingClientRect().top;
  rupture.style.setProperty('--gradient-in', (motion ? smooth(clamp((innerHeight - top) / (innerHeight * 1.2))) : 1).toFixed(4));
  const f = smooth(clamp((p - 0.04) / 0.8));
  rupture.dataset.fractured = String(f > 0.001);
  if (Math.abs(f - spores.f) > 0.0005) drawSpores(f);
  promiseState.textContent = p < 0.45 ? t.promiseA : t.promiseB;
}

// Scale: fly through a multiply-blended stencil word
const scaleTrack = $('[data-scale]');
const stencil = $('.scaleStencil', scaleTrack);
const stencilWord = $('span', stencil);
function updateScale() {
  const p = motion ? trackProgress(scaleTrack) : 1;
  const s = Math.pow(26, smooth(clamp(p / 0.85)));
  stencilWord.style.transform = `translateY(${((1 - clamp(p * 3)) * 18).toFixed(2)}vh) scale(${s.toFixed(3)})`;
  stencil.style.opacity = String(1 - smooth(clamp((p - 0.72) / 0.2)));
}

// Interface: shutters part, art zooms in, destination appears
const ifTrack = $('[data-interface]');
const stage = $('.stage', ifTrack);
// the split: black parts down its centre into two doors swinging into depth; the shadow they cast
// fades into the blue until it is the solid ground — done by --opening .85, before the destination lands
const split = $('[data-split]', stage);
const splitDoors = $('.split__doors', split), splitShade = $('.split__shade', split), splitBlue = $('.split__blue', split);
const [doorL, doorR] = split.querySelectorAll('.split__door');
// chrome balloons rise through the opening while the black gives way to the blue
const balloons = createBalloons($('.split__balloons', split));
const easeOut = (t) => 1 - (1 - t) ** 2.2;
function renderSplit(p) {
  const W = split.clientWidth, half = W / 2, P = W * 0.9;
  const th = easeOut(p) * (Math.PI / 2) * 0.98, sin = Math.sin(th);
  // projected half-gap: the doors' free edges recede into depth, so the opening reads narrower than the swing
  const g = half * (1 - Math.cos(th)) * (P / (P + half * sin));
  const L = half - g, R = half + g, spread = Math.min(g, 24 + g * 0.45);
  // the doors' shadow on the blue: dense at the free edges, thinning toward the centre, then dissolving into solid blue
  const a = 0.88 * (1 - smooth(clamp((p - 0.45) / 0.55)));
  const k = `rgba(0,0,0,${a.toFixed(3)})`, z = 'rgba(0,0,0,0)', px = (v) => `${v.toFixed(1)}px`;
  splitShade.style.background = `linear-gradient(to right, ${k} 0, ${k} ${px(L)}, ${z} ${px(L + spread)}, ${z} ${px(R - spread)}, ${k} ${px(R)}, ${k} 100%)`;
  splitDoors.style.perspective = `${Math.round(P)}px`;
  const deg = (th * 180) / Math.PI;
  doorL.style.transform = `rotateY(${deg.toFixed(3)}deg)`;
  doorR.style.transform = `rotateY(${(-deg).toFixed(3)}deg)`;
  splitDoors.style.opacity = String(1 - smooth(clamp((p - 0.8) / 0.2)));
  split.style.setProperty('--split-lit', clamp(sin * 1.6).toFixed(3));
  splitBlue.style.visibility = splitShade.style.visibility = p > 0 ? 'visible' : 'hidden';
}
const OPEN_SPAN = 0.55; // fraction of the track that scrubs --opening
function setOpening(o) {
  stage.style.setProperty('--opening', o.toFixed(4));
  renderSplit(clamp(o / 0.85));
  balloons.render(motion ? clamp((o - 0.3) / 0.7) : 0);
}
function updateInterface() {
  const o = clamp(trackProgress(ifTrack) / OPEN_SPAN);
  setOpening(motion ? o : o > 0.5 ? 1 : 0);
}

function onScroll() {
  updateChrome();
  updatePrologue();
  renderAnam();
  updateRupture();
  updateScale();
  updateInterface();
}
lenis.on('scroll', onScroll);
addEventListener('resize', onScroll);
onScroll();

/* ------------------------------------------------------------------
   Cursor: a soft blue blur that trails the pointer across the whole page.
   Over dark surfaces (blue or carbon) it turns white so it stays visible.
   ------------------------------------------------------------------ */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  html.classList.add('has-halo');
  const halo = document.createElement('div');
  halo.className = 'halo';
  halo.setAttribute('aria-hidden', 'true');
  document.body.append(halo);
  const pos = { x: -100, y: -100, tx: -100, ty: -100 };
  let raf = 0;
  const follow = () => {
    const k = motion ? 0.22 : 1;
    pos.x += (pos.tx - pos.x) * k;
    pos.y += (pos.ty - pos.y) * k;
    halo.style.setProperty('--x', `${pos.x.toFixed(1)}px`);
    halo.style.setProperty('--y', `${pos.y.toFixed(1)}px`);
    raf = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.3 ? requestAnimationFrame(follow) : 0;
  };
  const surfaceUnder = (x, y) => {
    for (const el of document.elementsFromPoint(x, y)) {
      if (el === halo) continue;
      if (el.surfaceAt) return el.surfaceAt(x, y);
      const s = el.closest('[data-surface]');
      if (s) return s.dataset.surface;
      if (el.closest('.header')) continue; // mostly transparent: read the surface underneath
      if (el.closest('.foot')) return document.documentElement.dataset.footerMode;
    }
    return 'paper';
  };
  const place = (e) => {
    pos.tx = e.clientX; pos.ty = e.clientY;
    if (!halo.classList.contains('is-on')) { pos.x = pos.tx; pos.y = pos.ty; halo.classList.add('is-on'); }
    halo.classList.toggle('is-hot', !!e.target.closest?.('a, button, input, [data-shape], canvas[data-bank], [data-anamorph], [data-control]'));
    halo.classList.toggle('is-light', surfaceUnder(e.clientX, e.clientY) !== 'paper');
    if (!raf) raf = requestAnimationFrame(follow);
  };
  addEventListener('pointermove', place, { passive: true });
  addEventListener('pointerdown', () => halo.classList.add('is-down'));
  addEventListener('pointerup', () => halo.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => halo.classList.remove('is-on', 'is-hot', 'is-down'));
  // a modal <dialog> renders in the top layer, above any z-index: carry the cursor into it
  const dlg = $('.dialog');
  new MutationObserver(() => (dlg.open ? dlg : document.body).append(halo)).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  // content scrolls under a still pointer: re-check the surface after scrolling
  lenis.on('scroll', () => { if (halo.classList.contains('is-on')) halo.classList.toggle('is-light', surfaceUnder(pos.tx, pos.ty) !== 'paper'); });
}

/* ------------------------------------------------------------------
   01 Anamorph
   ------------------------------------------------------------------ */
// The stage is pinned inside a taller track; scroll progress drives the viewing angle.
// It starts scattered, resolves into the word by 60% of the track and holds there.
// `var` on purpose: onScroll() runs before this section is evaluated, and renderAnam guards on it.
var anamTrack = $('[data-anamorph-track]');
var anamCanvas = $('[data-anamorph]');
var anamView = fitCanvas(anamCanvas);
var drawAnam = createAnamorph();
var anamDeg = null;
function renderAnam() {
  if (!drawAnam) return;
  const p = motion ? trackProgress(anamTrack) : 1;
  const deg = 72 * (1 - smooth(clamp(p / 0.6)));
  if (anamDeg !== null && Math.abs(deg - anamDeg) < 0.05) return;
  anamDeg = deg;
  drawAnam(anamView.ctx, anamView.w, anamView.h, deg, FONT);
}
new ResizeObserver(() => { anamDeg = null; renderAnam(); }).observe(anamCanvas);

/* ------------------------------------------------------------------
   Scene art loops (scale / interface)
   ------------------------------------------------------------------ */
const SCENES = { scale: drawScale };
$$('[data-scene]').forEach((canvas) => {
  const view = fitCanvas(canvas, 1.25);
  const draw = SCENES[canvas.dataset.scene];
  let frozen = 2.5;
  loopWhenVisible(canvas, (t) => {
    draw(view.ctx, view.w, view.h, motion ? t + 2.5 : frozen);
  }, () => true);
});

/* ------------------------------------------------------------------
   02 + 04 labs
   ------------------------------------------------------------------ */
{
  // scroll-driven: the blue block rises from its base as it enters, full once its top reaches ~20% of the viewport;
  // then the marionette takes over the records inside it (bar lowers, strings drop, records lift)
  const panel = $('[data-control]');
  const puppet = createMarionette($('canvas', panel), chapters.find((c) => c.id === 'el-control').events.map((e) => e[0]));
  loopWhenVisible(panel.parentElement, (t) => {
    const r = panel.parentElement.getBoundingClientRect();
    const d = (innerHeight * 0.95 - r.top) / (innerHeight * 0.75);
    const p = motion ? clamp(d) : 1;
    panel.style.transform = `scaleY(${(1 - (1 - p) ** 3).toFixed(4)})`;
    puppet.render(t, { q: motion ? clamp((d - 0.5) / 0.5) : 1, motion });
  }, () => true);
}
initLearning($('[data-learn]'), { isMotion });

/* ------------------------------------------------------------------
   06 Context
   ------------------------------------------------------------------ */
const bankCanvas = $('[data-bank]');
const chrome = createChrome(bankCanvas);
// Fluid chrome word: the pointer is the light; scroll lifts the word in and slides its reflections.
const light = { x: 0.5, y: 0.3, tx: 0.5, ty: 0.3, on: false };
bankCanvas.style.pointerEvents = 'auto';
bankCanvas.addEventListener('pointermove', (e) => {
  const r = bankCanvas.getBoundingClientRect();
  light.tx = (e.clientX - r.left) / r.width; light.ty = (e.clientY - r.top) / r.height; light.on = true;
});
bankCanvas.addEventListener('pointerleave', () => { light.on = false; });
let bankStatic = '';
loopWhenVisible(bankCanvas, (t) => {
  const r = bankCanvas.getBoundingClientRect();
  const vh = innerHeight;
  if (!light.on) { light.tx = motion ? 0.5 + 0.28 * Math.sin(t * 0.35) : 0.5; light.ty = motion ? 0.32 + 0.1 * Math.cos(t * 0.27) : 0.32; }
  const k = motion ? 0.12 : 1;
  light.x += (light.tx - light.x) * k; light.y += (light.ty - light.y) * k;
  const sig = `${Math.round(r.width)}x${Math.round(r.height)}:${document.fonts.status}:${light.x.toFixed(3)}:${light.y.toFixed(3)}`;
  if (!motion && bankStatic === sig) return;
  bankStatic = sig;
  chrome.render(r.width, r.height, {
    fontFamily: FONT, lx: light.x, ly: light.y,
    progress: motion ? (vh - r.top) / (vh * 0.75) : 1,
    scroll: motion ? r.top / vh : 0,
  });
}, () => true);

/* ------------------------------------------------------------------
   08 Choices
   ------------------------------------------------------------------ */
const QUESTIONS = {
  es: [
    { h: 'Auxiliar de Mercadotecnia en Radial Llantas', p: 'Desde octubre de 2023. Campañas en medios tradicionales, reportes de gasto del área y reportes de desempeño para Goodyear, Pirelli, Toyo Tires, Firestone, Bridgestone y Hankook.',
      routes: [['POP', 'Material para punto de venta y mantenimiento de imagen'], ['GMB', 'Administración de Google My Business'], ['Digital Signage', 'Contenido en pantallas con MagicINFO y Admira'], ['Eventos', 'Eventos internos, promociones y aperturas de puntos de venta']] },
    { h: 'Desarrollador de negocios en Cimeira', p: 'De junio a octubre de 2023. Diseñé modelos de negocio nuevos y reestructuré los que ya existían, junto con sus productos y servicios.',
      routes: [['Estrategia', 'Planeación y ejecución de marketing tradicional y digital'], ['Campañas', 'Diseño y presentación de promoción y publicidad'], ['Correo', 'Cuentas corporativas y firmas profesionales']] },
    { h: 'Creador de contenido', p: 'En Inspira Ideas que Unen, de septiembre de 2023 a junio de 2024, y antes en IDIT PYME, de septiembre a diciembre de 2022.',
      routes: [['YouTube', 'Miniaturas y edición de Shorts'], ['Foto', 'Reportes fotográficos y de video, retoque para digital'], ['Redes', 'Gráficos para Meta Business Suite y copies para publicaciones']] },
  ],
  en: [
    { h: 'Marketing Assistant at Radial Llantas', p: 'Since October 2023. Traditional media campaigns, department spending reports and performance reports for Goodyear, Pirelli, Toyo Tires, Firestone, Bridgestone and Hankook.',
      routes: [['POP', 'Point-of-sale materials and image upkeep'], ['GMB', 'Google My Business management'], ['Digital Signage', 'Screen content with MagicINFO and Admira'], ['Events', 'Internal events, promotions and point-of-sale openings']] },
    { h: 'Business Developer at Cimeira', p: 'June to October 2023. I designed new business models and restructured existing ones, along with their products and services.',
      routes: [['Strategy', 'Planning and execution of traditional and digital marketing'], ['Campaigns', 'Design and presentation of promotions and advertising'], ['Email', 'Corporate accounts and professional signatures']] },
    { h: 'Content Creator', p: 'At Inspira Ideas que Unen, from September 2023 to June 2024, and before that at IDIT PYME, from September to December 2022.',
      routes: [['YouTube', 'Thumbnails and Shorts editing'], ['Photo', 'Photo and video reports, retouching for digital'], ['Social', 'Graphics for Meta Business Suite and copy for posts']] },
  ],
}[lang];
const fork = $('[data-fork]');
const responseEl = $('[data-response]');
function renderChoice(i, explored) {
  const d = QUESTIONS[i];
  responseEl.innerHTML = `
    <div><h3>${d.h}</h3><p>${d.p}</p></div>
    <nav class="routes" aria-label="${companyNames[i]}: ${t.whatIDid.toLowerCase()}">
      <p>${t.whatIDid}</p>
      ${d.routes.map(([y, t]) => `<div><span>${y}</span><span>${t}</span></div>`).join('')}
    </nav>`;
  responseEl.style.animation = 'none';
  void responseEl.offsetWidth;
  responseEl.style.animation = '';
  $$('[data-q]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.q) === i)));
  if (explored) fork.dataset.explored = 'true';
}
$$('[data-q]').forEach((b) => b.addEventListener('click', () => renderChoice(Number(b.dataset.q), true)));
renderChoice(0, false);

/* ------------------------------------------------------------------
   Chapters dialog
   ------------------------------------------------------------------ */
const dialog = $('.dialog');
const rail = $('.rail', dialog);
const preview = $('.menuPreview', dialog);
const previewNum = $('[data-preview-num]', dialog);
rail.innerHTML = chapters.map((c, i) => `<a href="#${c.id}" data-i="${i}"><span>${c.n}</span><span>${c.name}</span><span aria-hidden="true">↗</span></a>`).join('');
let postersBuilt = false;
function selectPreview(i) {
  previewNum.textContent = chapters[i].n;
  $$('img', preview).forEach((img, k) => (img.dataset.selected = String(k === i)));
}
function openDialog() {
  if (!postersBuilt) {
    postersBuilt = true;
    makePosters(FONT).forEach((src, i) => {
      const img = new Image();
      img.alt = '';
      img.src = src;
      preview.insertBefore(img, previewNum);
      if (i === Math.max(0, activeChapter)) img.dataset.selected = 'true';
    });
  }
  selectPreview(Math.max(0, activeChapter));
  lenis.stop();
  dialog.showModal();
}
function closeDialog() { dialog.close(); }
dialog.addEventListener('close', () => lenis.start());
$('.indexToggle').addEventListener('click', openDialog);
$('[data-close]', dialog).addEventListener('click', closeDialog);
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
rail.addEventListener('pointerover', (e) => { const a = e.target.closest('a'); if (a) selectPreview(Number(a.dataset.i)); });
rail.addEventListener('focusin', (e) => { const a = e.target.closest('a'); if (a) selectPreview(Number(a.dataset.i)); });
rail.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  e.preventDefault();
  closeDialog();
  lenis.scrollTo(a.getAttribute('href'), { duration: 1.6 });
});

/* ------------------------------------------------------------------
   Foot-bar toggles
   ------------------------------------------------------------------ */
const soundBtn = $('[data-sound]');
soundBtn.addEventListener('click', () => {
  const on = soundBtn.getAttribute('aria-pressed') !== 'true';
  soundBtn.setAttribute('aria-pressed', String(on));
  $('[data-label]', soundBtn).textContent = on ? t.soundOn : t.soundOff;
});
const motionBtn = $('[data-motion]');
motionBtn.setAttribute('aria-pressed', String(motion));
$('[data-label]', motionBtn).textContent = motion ? t.motionOn : t.motionOff;
motionBtn.addEventListener('click', () => {
  motion = !motion;
  exhibition.dataset.exhibitionMotion = String(motion);
  motionBtn.setAttribute('aria-pressed', String(motion));
  $('[data-label]', motionBtn).textContent = motion ? t.motionOn : t.motionOff;
  if (!motion) $$('[data-reveal]').forEach((el) => el.removeAttribute('data-reveal'));
  requestAnimationFrame(onScroll);
});
const langBtn = $('[data-lang]');
langBtn.setAttribute('aria-label', t.langSwitch);
langBtn.addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));

/* Re-draw text-based canvases once the web font is ready */
// Hero panel: a full-height blue field on the right. It starts near 81% of the width (where the
// header nav begins) but never touches the title. Anything sitting on it turns white.
const heroPanel = $('.heroPanel');
const onPanelEls = () => [...$$('.nav a'), $('.openingNote > span:last-child'), $('.beginText'), $('.beginArrow')];
let panelX = Infinity;
function placeHeroPanel() {
  const opening = $('.opening');
  opening.style.removeProperty('--t1');
  if (getComputedStyle(heroPanel).display === 'none') { panelX = Infinity; markOnPanel(); return; }
  const o = opening.getBoundingClientRect();
  const navLeft = $('.nav a').getBoundingClientRect().left - o.left;
  const left = Math.min(o.width * 0.81, navLeft - 36); // the panel always starts before the nav
  // title width grows linearly with --t1: shrink it only when it would reach the panel
  const first = $('.titleFirst');
  const t1 = parseFloat(getComputedStyle(first).fontSize);
  const x0 = first.getBoundingClientRect().left - o.left;
  const right = Math.max(first.getBoundingClientRect().right, $('.titleLast').getBoundingClientRect().right) - o.left;
  const k = (right - x0) / t1, GAP = 0.14;
  if (right + t1 * GAP > left) opening.style.setProperty('--t1', `${((left - x0) / (k + GAP)).toFixed(1)}px`);
  heroPanel.style.left = `${left.toFixed(1)}px`;
  panelX = o.left + left;
  html.style.setProperty('--panel-x', `${panelX.toFixed(1)}px`);
  markOnPanel();
}
function markOnPanel() {
  const o = $('.opening').getBoundingClientRect();
  const headerOver = o.bottom > 70; // the fixed header still sits over the hero
  html.classList.toggle('header-on-hero', headerOver && panelX < Infinity);
  for (const el of onPanelEls()) {
    const r = el.getBoundingClientRect();
    const inHeader = !!el.closest('.header');
    el.classList.toggle('onPanel', r.left >= panelX - 1 && (!inHeader || headerOver));
  }
}
new ResizeObserver(placeHeroPanel).observe($('.opening'));
lenis.on('scroll', markOnPanel);
document.fonts.ready.then(() => { placeHeroPanel(); renderAnam(); onScroll(); });
