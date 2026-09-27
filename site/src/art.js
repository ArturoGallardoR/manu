// Procedural stand-ins for the original's photographs, videos and WebGL sculptures.
// Palette is locked to the spec: night, silver, carbon and the single blue accent.

import { t } from './i18n.js';

const NIGHT = '#090e13';
const PAPER = '#f2f4f1';
const BLUE = [35, 74, 232];
const TAU = Math.PI * 2;

export const DPR = () => Math.min(window.devicePixelRatio || 1, 1.75);

/** Keep a canvas sized to its CSS box; returns { ctx, w, h } getter. */
export function fitCanvas(canvas, dprCap) {
  const ctx = canvas.getContext('2d');
  const state = { ctx, w: 0, h: 0 };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const d = dprCap ? Math.min(DPR(), dprCap) : DPR();
    state.w = Math.max(1, r.width);
    state.h = Math.max(1, r.height);
    canvas.width = Math.round(state.w * d);
    canvas.height = Math.round(state.h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    state.dirty = true;
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  return state;
}

/** Run draw(t) every frame only while the element is on screen. */
export function loopWhenVisible(el, draw, isMotion = () => true) {
  let visible = false, raf = 0, t0 = performance.now();
  const tick = (now) => {
    raf = 0;
    if (!visible) return;
    draw((now - t0) / 1000);
    if (isMotion()) raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }, { rootMargin: '100px' }).observe(el);
  return { kick: () => { if (visible && !raf) raf = requestAnimationFrame(tick); } };
}

// Deterministic pseudo-random
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}


/* ------------------------------------------------------------------
   Hero sculpture: a striated ribbed surface with a thin blue band.
   pose ∈ [0, 2]: 0 Rules (faceted), 1 Learning (two peaks), 2 Context (wave)
   ------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   Anamorph "THINK?" — vertical metal slats that only align at 0°
   ------------------------------------------------------------------ */
const ANAMORPH_WORD = t.anamorphWord;
export function createAnamorph() {
  const metal = document.createElement('canvas');
  const offsets = [];
  const r = rng(7);
  for (let i = 0; i < 400; i++) offsets.push(r() * 2 - 1);
  let builtFor = '';
  const build = (w, h, fontFamily) => {
    const key = `${w}x${h}:${document.fonts.status}`;
    if (key === builtFor) return;
    builtFor = key;
    metal.width = Math.round(w);
    metal.height = Math.round(h);
    const m = metal.getContext('2d');
    m.clearRect(0, 0, w, h);
    // fit the word to ~92% of the width, capped by the height
    m.font = `500 100px ${fontFamily}`;
    const size = Math.min(h * 1.08, (w * 0.92 * 100) / m.measureText(ANAMORPH_WORD).width);
    m.font = `500 ${size}px ${fontFamily}`;
    m.textAlign = 'center';
    m.textBaseline = 'middle';
    m.fillStyle = '#fff';
    m.save();
    m.translate(w / 2, h / 2);
    m.scale(1, 1);
    m.fillText(ANAMORPH_WORD, 0, size * 0.04);
    m.restore();
    m.globalCompositeOperation = 'source-in';
    const g = m.createLinearGradient(0, h * 0.1, 0, h * 0.95);
    g.addColorStop(0, '#f4f6f7');
    g.addColorStop(0.55, '#d4dade');
    g.addColorStop(1, '#8e98a8');
    m.fillStyle = g;
    m.fillRect(0, 0, w, h);
    m.globalCompositeOperation = 'source-over';
  };
  return (ctx, w, h, deg, fontFamily) => {
    build(w, h, fontFamily);
    ctx.clearRect(0, 0, w, h);
    const a = (deg * Math.PI) / 180;
    const slat = Math.max(6, w / 150);
    const n = Math.ceil(w / slat);
    for (let i = 0; i < n; i++) {
      const x = i * slat;
      const off = offsets[i % offsets.length];
      const dy = Math.sin(a) * off * h * 0.75;
      const sw = slat * Math.max(0.25, Math.cos(a * 0.8));
      ctx.drawImage(metal, x, 0, slat, h, x + (slat - sw) / 2, dy, sw, h);
    }
    // slat seams
    ctx.fillStyle = 'rgba(9,14,19,0.55)';
    for (let i = 0; i < n; i++) ctx.fillRect(i * slat, 0, 1, h);
  };
}

/* ------------------------------------------------------------------
   Scene art — "imagined installations"
   ------------------------------------------------------------------ */
function noiseTexture(size = 256, seed = 3, alpha = 0.06) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const img = x.createImageData(size, size);
  const r = rng(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + r() * 120;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = r() * 255 * alpha;
  }
  x.putImageData(img, 0, 0);
  return c;
}
let grain;

export function drawPromise(ctx, w, h, t) {
  grain ||= noiseTexture();
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, w, h);
  // concrete wall on the right
  const wall = ctx.createLinearGradient(w * 0.38, 0, w, 0);
  wall.addColorStop(0, 'rgba(58,62,66,0)');
  wall.addColorStop(0.35, 'rgba(58,62,66,0.9)');
  wall.addColorStop(1, 'rgba(34,37,41,1)');
  ctx.fillStyle = wall;
  ctx.fillRect(w * 0.38, 0, w * 0.62, h * 0.72);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = ctx.createPattern(grain, 'repeat');
  ctx.fillRect(0, 0, w, h * 0.72);
  ctx.globalAlpha = 1;
  // skylight beam: a diagonal slot of light
  ctx.save();
  const beam = ctx.createLinearGradient(w * 0.5, h * 0.35, w * 0.85, 0);
  beam.addColorStop(0, 'rgba(220,226,228,0.05)');
  beam.addColorStop(0.6, 'rgba(230,234,236,0.55)');
  beam.addColorStop(1, 'rgba(245,247,248,0.9)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(w * 0.49, h * 0.3);
  ctx.lineTo(w * 0.72, 0);
  ctx.lineTo(w * 0.92, 0);
  ctx.lineTo(w * 0.52, h * 0.38);
  ctx.closePath();
  ctx.fill();
  // haze
  const haze = ctx.createRadialGradient(w * 0.66, h * 0.32, 10, w * 0.66, h * 0.32, w * 0.45);
  haze.addColorStop(0, 'rgba(200,208,214,0.16)');
  haze.addColorStop(1, 'rgba(200,208,214,0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  // floor + blue horizon
  const floor = ctx.createLinearGradient(0, h * 0.7, 0, h);
  floor.addColorStop(0, '#0d1318');
  floor.addColorStop(1, NIGHT);
  ctx.fillStyle = floor;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  const hz = ctx.createLinearGradient(w * 0.3, 0, w, 0);
  hz.addColorStop(0, 'rgba(35,74,232,0)');
  hz.addColorStop(0.7, 'rgba(90,130,255,0.55)');
  hz.addColorStop(1, 'rgba(35,74,232,0.1)');
  ctx.fillStyle = hz;
  ctx.fillRect(w * 0.3, h * 0.695, w * 0.7, 2);
}

export function drawScale(ctx, w, h) {
  // solid blue field; the fade to night at the bottom comes from .scaleFrame::after
  ctx.fillStyle = `rgb(${BLUE.join(',')})`;
  ctx.fillRect(0, 0, w, h);
}

export function drawInterface(ctx, w, h, t) {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.52, cy = h * 0.46;
  const N = 46;
  for (let k = N; k >= 0; k--) {
    const z = ((k + (t * 1.2) % 1) / N);
    const s = Math.pow(1 - z, 2.3);
    if (s < 0.01) continue;
    const rw = w * 1.1 * s + 30, rh = h * 1.2 * s + 44;
    ctx.save();
    ctx.translate(cx + Math.sin(z * 4 + t * 0.3) * 30 * (1 - s), cy + Math.cos(z * 3) * 14 * (1 - s));
    ctx.rotate(0.35 * (1 - s) + Math.sin(t * 0.2) * 0.05 + 0.18);
    const L = Math.round(40 + 190 * s);
    ctx.strokeStyle = `rgba(${L},${L + 6},${L + 12},${0.25 + 0.75 * s})`;
    ctx.lineWidth = Math.max(0.6, 16 * s);
    ctx.beginPath();
    ctx.roundRect(-rw / 2, -rh / 2, rw, rh, Math.min(rw, rh) * 0.08);
    ctx.stroke();
    if (k % 5 === 0) {
      ctx.strokeStyle = `rgba(${BLUE[0] + 40},${BLUE[1] + 50},255,${0.5 * s})`;
      ctx.lineWidth = Math.max(0.5, 3 * s);
      ctx.stroke();
    }
    ctx.restore();
  }
  const lg = ctx.createLinearGradient(w * 0.3, 0, w, 0);
  lg.addColorStop(0, 'rgba(60,110,255,0)');
  lg.addColorStop(0.6, 'rgba(110,150,255,0.9)');
  lg.addColorStop(1, 'rgba(60,110,255,0.2)');
  ctx.strokeStyle = lg;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.66);
  ctx.lineTo(w, h * 0.52);
  ctx.stroke();
}

/* ------------------------------------------------------------------
   Context: inflated "fluid chrome" word on solid blue (WebGL)
   ------------------------------------------------------------------ */
// A 2D canvas bakes the word into a field: R = tight blur (rounded rim), G = wide blur
// (the dome), B = crisp mask. The shader turns that height field into normals and
// shades it as chrome reflecting a studio lit by the pointer and slid by the scroll.
const CHROME_WORD = 'SEO';
const chromeLayout = (w, h, fontFamily) => {
  const x = document.createElement('canvas').getContext('2d');
  x.font = `500 100px ${fontFamily}`;
  const size = Math.min(380, h * 0.36, (w * 0.5 * 100) / x.measureText(CHROME_WORD).width);
  return { size, amp: size * 0.16 };
};
function chromeField(w, h, fontFamily, size) {
  const d = Math.min(DPR(), 1.25);
  const W = Math.max(1, Math.round(w * d)), H = Math.max(1, Math.round(h * d));
  const cv = (fn) => { const c = document.createElement('canvas'); c.width = W; c.height = H; fn(c.getContext('2d')); return c; };
  const mask = cv((x) => {
    x.font = `500 ${size * d}px ${fontFamily}`;
    x.textAlign = 'center';
    if (x.letterSpacing !== undefined) x.letterSpacing = `${size * 0.07 * d}px`;
    x.fillStyle = x.strokeStyle = '#fff';
    x.lineWidth = size * 0.13 * d; x.lineJoin = 'round'; x.lineCap = 'round';
    const base = (h / 2 + size * 0.36) * d;
    x.strokeText(CHROME_WORD, W / 2, base); x.fillText(CHROME_WORD, W / 2, base);
  });
  // blur via an offset shadow: works everywhere, unlike ctx.filter
  const blur = (sigma) => cv((x) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    x.shadowColor = '#fff'; x.shadowBlur = sigma * 2; x.shadowOffsetX = W;
    x.drawImage(mask, -W, 0);
  });
  const px = (c) => c.getContext('2d').getImageData(0, 0, W, H).data;
  const r = px(blur(size * 0.035 * d)), g = px(blur(size * 0.09 * d)), m = px(mask);
  // height in float, then a separable box blur erases the 8-bit steps of the canvas blurs
  // so the normals (and the reflections) come out glassy smooth
  const n = W * H, ht = new Float32Array(n), tmp = new Float32Array(n), amp = size * 0.16;
  for (let i = 0; i < n; i++) ht[i] = amp * (Math.sqrt(Math.min(1, Math.max(0, r[i * 4] / 127.5 - 1))) * 0.6 + (g[i * 4] / 255) * 0.4);
  const R = Math.max(1, Math.round(1.5 * d));
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < H; y++) { const o = y * W; let s = 0; for (let x = -R; x <= R; x++) s += ht[o + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { tmp[o + x] = s / (2 * R + 1); s += ht[o + Math.min(W - 1, x + R + 1)] - ht[o + Math.max(0, x - R)]; } }
    for (let x = 0; x < W; x++) { let s = 0; for (let y = -R; y <= R; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { ht[y * W + x] = s / (2 * R + 1); s += tmp[Math.min(H - 1, y + R + 1) * W + x] - tmp[Math.max(0, y - R) * W + x]; } }
  }
  // pack: RG = surface normal xy, B = crisp mask, A = wide blur (drop shadow)
  const out = new ImageData(W, H), o = out.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const sx = (ht[y * W + Math.min(W - 1, x + 1)] - ht[y * W + Math.max(0, x - 1)]) * d / 2;
    const sy = (ht[Math.min(H - 1, y + 1) * W + x] - ht[Math.max(0, y - 1) * W + x]) * d / 2;
    const l = Math.hypot(sx, sy, 1);
    o[i * 4] = (-sx / l * 0.5 + 0.5) * 255; o[i * 4 + 1] = (sy / l * 0.5 + 0.5) * 255;
    o[i * 4 + 2] = m[i * 4 + 3]; o[i * 4 + 3] = g[i * 4];
  }
  return out;
}
const CHROME_VS = 'attribute vec2 a;varying vec2 vUv;void main(){vUv=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
const CHROME_GLSL = `
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
vec3 env(vec3 r) {
  float y = r.y;
  vec3 sky = mix(vec3(.7, .76, .94), vec3(1.), smoothstep(.15, .85, y));
  vec3 flo = mix(uBlue * .22, uBlue * .95, smoothstep(-1., -.15, y));
  vec3 c = mix(flo, sky, smoothstep(-.04, .04, y));
  float hz = (y - .06) * 9.;
  c *= 1. - .85 * exp(-hz * hz);
  float az = atan(r.x, r.z) + uScroll * 1.5;
  c = mix(c, vec3(1.), smoothstep(.86, .98, cos(az * 3.)) * smoothstep(.05, .35, y) * .85);
  c = mix(c, c * vec3(.12, .14, .22), smoothstep(.55, 1., cos(az * 2. + 1.3)) * (1. - smoothstep(-.5, .1, y)) * .8);
  return c;
}
// the studio light and the chrome's blue-tinted grazing rim, shared by the word and the balloons
vec3 chromeShade(vec3 n, vec2 l, float tilt) {
  vec3 r = rotY(l.x * .9) * rotX(-l.y * .7 + tilt) * reflect(vec3(0., 0., -1.), n);
  vec3 ch = env(r);
  float nh = max(dot(n, normalize(normalize(vec3(l.x * 2.2, -l.y * 2.2, 1.)) + vec3(0., 0., 1.))), 0.);
  ch += pow(nh, 90.) * 1.3 + pow(nh, 14.) * .18;
  return mix(ch, ch * uBlue * 1.6 + .05, pow(1. - n.z, 2.) * .35);
}`;

/* ------------------------------------------------------------------
   02 El control — a marionette: three records hang from one control bar.
   q ∈ [0,1] scrubs the take-over: bar lowers, strings drop, records lift off the floor.
   The pointer is the puppeteer's hand: x tilts the bar, the nearest record gets pulled up.
   ------------------------------------------------------------------ */
export function createMarionette(canvas, labels) {
  const ctx = canvas.getContext('2d');
  let w = 1, h = 1, d = 1;
  // clientWidth/Height ignore the parent's scaleY rise, unlike getBoundingClientRect
  const resize = () => {
    w = Math.max(1, canvas.clientWidth); h = Math.max(1, canvas.clientHeight); d = Math.min(DPR(), 1.5);
    canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  const hand = { x: 0.5, y: 0.5, on: false };
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    hand.x = (e.clientX - r.left) / r.width; hand.y = (e.clientY - r.top) / r.height; hand.on = true;
  });
  canvas.addEventListener('pointerleave', () => { hand.on = false; });
  const SLOT = [-0.8, 0, 0.8], LEN = [0.8, 0.94, 0.7], REST = [-0.05, 0.035, -0.02];
  const pieces = labels.map((label, i) => ({ label, n: String(i + 1).padStart(2, '0'), i, x: 0, y: 0, a: 0, vx: 0, vy: 0, va: 0, lift: 0 }));
  const bar = { x: 0, y: 0, a: 0, init: false };
  const ease = (t) => 1 - (1 - t) ** 3;
  const c01 = (v) => Math.min(1, Math.max(0, v));
  const spring = (p, key, target, k, c, dt) => {
    const v = `v${key}`;
    p[v] += ((target - p[key]) * k - p[v] * c) * dt;
    p[key] += p[v] * dt;
  };
  let last = 0, pw = 0, ph = 0;
  // the cursor reads the surface under it: paper on a record, blue everywhere else
  canvas.surfaceAt = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    const px = ((cx - r.left) * w) / r.width, py = ((cy - r.top) * h) / r.height;
    return pieces.some((p) => {
      const dx = px - p.x, dy = py - p.y, c = Math.cos(p.a), s = Math.sin(p.a);
      return Math.abs(dx * c + dy * s) <= pw / 2 && Math.abs(-dx * s + dy * c) <= ph / 2;
    }) ? 'paper' : 'blue';
  };
  return { render(t, { q = 1, motion = true } = {}) {
    const dt = Math.min(1 / 30, Math.max(0, t - last)); last = t;
    const x = ctx;
    x.setTransform(d, 0, 0, d, 0, 0);
    x.clearRect(0, 0, w, h);
    const floor = h * 0.9, half = w * 0.3;
    pw = Math.min(w * 0.2, 210); ph = pw * 0.62;
    const drop = ease(c01(q / 0.3)), take = ease(c01((q - 0.45) / 0.45));
    const idle = motion ? t : 0;
    const on = hand.on && motion;
    const bx = w / 2 + (on ? (hand.x - 0.5) * w * 0.22 : Math.sin(idle * 0.45) * w * 0.025);
    const by = -h * 0.06 + (h * 0.19) * drop + (on ? (hand.y - 0.5) * h * 0.05 : 0);
    const ba = on ? (hand.x - 0.5) * 0.34 : Math.sin(idle * 0.9) * 0.07;
    if (!bar.init || !motion) { bar.x = bx; bar.y = by; bar.a = ba; bar.init = true; }
    const kb = 1 - Math.exp(-dt * 9);
    bar.x += (bx - bar.x) * kb; bar.y += (by - bar.y) * kb; bar.a += (ba - bar.a) * kb;
    const cos = Math.cos(bar.a), sin = Math.sin(bar.a);
    const onBar = (u) => [bar.x + u * cos, bar.y + u * sin];
    const ink = '#f2f4f1';
    // floor: the stage every record rests on until it is taken over
    x.strokeStyle = 'rgba(242,244,241,.28)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(w * 0.06, floor + 0.5); x.lineTo(w * 0.94, floor + 0.5); x.stroke();
    // the hand: one line from above to the bar's centre
    x.strokeStyle = ink; x.lineWidth = 1;
    x.beginPath(); x.moveTo(bar.x, 0); x.lineTo(bar.x, bar.y); x.stroke();
    x.lineWidth = 2.5; x.lineCap = 'round';
    const [l0, l1] = onBar(-half), [r0, r1] = onBar(half);
    x.beginPath(); x.moveTo(l0, l1); x.lineTo(r0, r1);
    // the cross piece
    x.moveTo(bar.x - sin * half * 0.18, bar.y + cos * half * 0.18 * 0.4); x.lineTo(bar.x + sin * half * 0.18, bar.y - cos * half * 0.18 * 0.4);
    x.stroke();
    x.lineCap = 'butt';
    x.fillStyle = ink; x.beginPath(); x.arc(bar.x, bar.y, 3, 0, TAU); x.fill();
    const maxLen = floor - h * 0.13 - ph;
    for (const p of pieces) {
      const u = SLOT[p.i] * half, k = pw * 0.28;
      const [ax, ay] = onBar(u - k), [cx2, cy2] = onBar(u + k);
      const mx = (ax + cx2) / 2, my = (ay + cy2) / 2;
      // the pull: records hop in turn at rest, the one under the hand rises on its strings
      const hop = motion ? Math.max(0, Math.sin(idle * 1.7 + p.i * 2.1)) ** 2 * h * 0.03 : 0;
      const near = on ? Math.exp(-(((hand.x * w - (w / 2 + SLOT[p.i] * half)) / (w * 0.12)) ** 2)) * h * 0.09 : 0;
      p.lift += ((on ? near : hop) - p.lift) * (1 - Math.exp(-dt * 8));
      const hx = mx, hy = my + maxLen * LEN[p.i] - p.lift + ph / 2;
      const restX = w / 2 + SLOT[p.i] * half, restY = floor - ph / 2;
      const tx = restX + (hx - restX) * take, ty = restY + (hy - restY) * take;
      const ta = REST[p.i] * (1 - take) + bar.a * 0.7 * take;
      if (!motion || p.y === 0) { p.x = tx; p.y = ty; p.a = ta; p.vx = p.vy = p.va = 0; }
      else { spring(p, 'x', tx, 70, 7, dt); spring(p, 'y', ty, 90, 10, dt); spring(p, 'a', ta, 60, 6, dt); }
      const pc = Math.cos(p.a), ps = Math.sin(p.a), hole = -ph / 2 + Math.max(7, ph * 0.1);
      const toWorld = (lx, ly) => [p.x + lx * pc - ly * ps, p.y + lx * ps + ly * pc];
      const ties = [[ax, ay, -pw * 0.42, -1], [cx2, cy2, pw * 0.42, 1]];
      // strings: from the bar straight into each record's eyelet — slack while it lies on the floor, taut once lifted
      x.strokeStyle = 'rgba(242,244,241,.9)'; x.lineWidth = 1;
      for (const [sx, sy, lx, side] of ties) {
        const [ex, ey] = toWorld(lx, hole);
        const sag = (1 - take) * Math.min(w, h) * 0.08 * side;
        x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo((sx + ex) / 2 + sag, (sy + ey) / 2, ex, ey); x.stroke();
        x.fillStyle = ink; x.beginPath(); x.arc(sx, sy, 2.2, 0, TAU); x.fill();
      }
      // the record itself; the thread keeps running, in blue, from its top edge into the eyelet
      x.save(); x.translate(p.x, p.y); x.rotate(p.a);
      x.fillStyle = ink; x.fillRect(-pw / 2, -ph / 2, pw, ph);
      x.strokeStyle = x.fillStyle = 'rgb(35,74,232)'; x.lineWidth = 1;
      for (const [sx, sy, lx, side] of ties) {
        const [ex, ey] = toWorld(lx, hole);
        const sag = (1 - take) * Math.min(w, h) * 0.08 * side;
        const dx = (sx + ex) / 2 + sag - p.x, dy = (sy + ey) / 2 - p.y;
        const cxl = dx * pc + dy * ps, cyl = -dx * ps + dy * pc;
        const k = (-ph / 2 - hole) / Math.min(-0.0001, cyl - hole);
        const qx = lx + (cxl - lx) * k, qy = -ph / 2;
        x.beginPath(); x.moveTo(qx, qy); x.lineTo(lx, hole); x.stroke();
        x.beginPath(); x.arc(lx, hole, 3.2, 0, TAU); x.stroke();
        x.beginPath(); x.arc(lx, hole, 1.4, 0, TAU); x.fill();
      }
      const pad = pw * 0.08;
      x.fillStyle = 'rgb(35,74,232)';
      x.textBaseline = 'alphabetic'; x.textAlign = 'left';
      x.font = `400 ${Math.max(9, pw * 0.055).toFixed(1)}px "Space Mono", ui-monospace, monospace`;
      x.fillText(p.n, -pw / 2 + pad + pw * 0.08, -ph / 2 + pad + pw * 0.06);
      x.font = `500 ${Math.max(12, pw * 0.13).toFixed(1)}px "Inter Tight", "Helvetica Neue", Arial, sans-serif`;
      x.fillText(p.label, -pw / 2 + pad, ph / 2 - pad);
      x.restore();
    }
  } };
}

const CHROME_FS = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes, uLight;
uniform float uScale, uOffY, uAlpha, uScroll, uAmp;
uniform vec3 uBlue;
${CHROME_GLSL}
void main() {
  vec2 p = vUv * uRes, c = uRes * .5;
  vec2 uv = ((p - vec2(c.x, c.y + uOffY)) / uScale + c) / uRes;
  vec3 col = uBlue * (1. - .45 * uAlpha * texture2D(uTex, uv - vec2(.3, .7) * uAmp / uRes).a);
  vec4 t = texture2D(uTex, uv);
  float m = smoothstep(.3, .7, t.b);
  if (m > 0.) {
    vec2 nxy = t.rg * 2. - 1.;
    vec3 n = vec3(nxy, sqrt(max(0., 1. - dot(nxy, nxy))));
    col = mix(col, chromeShade(n, uLight - .5, (1. - uAlpha) * .6), m * uAlpha);
  }
  gl_FragColor = vec4(col, 1.);
}`;
// a balloon is an analytic teardrop ellipsoid: its normal comes straight from the shape
const BALLOON_FS = `precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uScroll;
uniform vec3 uBlue;
${CHROME_GLSL}
void main() {
  float R = uRes.x * .5;
  vec2 q = (vUv * uRes - vec2(R, R * 1.12)) / R;
  float yy = q.y / 1.08, rx = .92 * (1. - .16 * smoothstep(-.3, 1., yy));
  vec2 u = vec2(q.x / rx, yy);
  float d = dot(u, u), a = 1. - smoothstep(1. - 3. / R, 1., d);
  if (a <= 0.) { gl_FragColor = vec4(0.); return; }
  vec3 n = normalize(vec3(u.x, -u.y, sqrt(max(0., 1. - d)) * 1.1));
  vec3 ch = min(chromeShade(n, vec2(-.15, -.2), 0.), vec3(1.));
  gl_FragColor = vec4(ch * a, a);
}`;

/** Chrome renderer bound to a canvas; render(w, h, opts) sizes, bakes and draws. */
export function createChrome(canvas, keep = false) {
  const blue = `rgb(${BLUE.join(',')})`;
  const size = (w, h) => {
    const d = Math.min(DPR(), 1.5), W = Math.max(1, Math.round(w * d)), H = Math.max(1, Math.round(h * d));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  };
  const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: keep });
  if (!gl) {
    const x = canvas.getContext('2d');
    return { canvas, render(w, h, { fontFamily = 'sans-serif' } = {}) {
      size(w, h);
      const d = canvas.width / w, { size: fs } = chromeLayout(w, h, fontFamily);
      x.setTransform(d, 0, 0, d, 0, 0); x.fillStyle = blue; x.fillRect(0, 0, w, h);
      x.font = `500 ${fs}px ${fontFamily}`; x.textAlign = 'center'; x.fillStyle = '#e9eefc';
      x.fillText(CHROME_WORD, w / 2, h * 0.63 + fs * 0.36);
    } };
  }
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn('chrome shader:', gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, CHROME_VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, CHROME_FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const u = {};
  for (const n of ['uTex', 'uRes', 'uLight', 'uScale', 'uOffY', 'uAlpha', 'uScroll', 'uAmp', 'uBlue']) u[n] = gl.getUniformLocation(prog, n);
  gl.uniform3f(u.uBlue, BLUE[0] / 255, BLUE[1] / 255, BLUE[2] / 255);
  let key = '', amp = 0;
  return { canvas, render(w, h, { fontFamily = 'sans-serif', lx = 0.5, ly = 0.3, progress = 1, scroll = 0 } = {}) {
    size(w, h);
    const k = `${Math.round(w)}x${Math.round(h)}:${fontFamily}:${document.fonts.status}`;
    if (k !== key) {
      key = k;
      const lay = chromeLayout(w, h, fontFamily);
      amp = lay.amp;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, chromeField(w, h, fontFamily, lay.size));
    }
    const p = Math.min(1, Math.max(0, progress)), ep = 1 - (1 - p) ** 3;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, w, h);
    gl.uniform2f(u.uLight, lx, ly);
    gl.uniform1f(u.uScale, 0.82 + 0.18 * ep);
    gl.uniform1f(u.uOffY, h * 0.13 + (1 - ep) * h * 0.2);
    gl.uniform1f(u.uAlpha, ep);
    gl.uniform1f(u.uScroll, scroll);
    gl.uniform1f(u.uAmp, amp);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } };
}


/* ------------------------------------------------------------------
   Chrome balloons rising through the split, scrubbed by progress p ∈ [0, 1]
   ------------------------------------------------------------------ */
function balloonKnot(x, R) {
  const cx = R, y = R * 1.12 + R * 1.08;
  const k = x.createLinearGradient(cx - R * 0.1, 0, cx + R * 0.1, 0);
  k.addColorStop(0, '#6d7480'); k.addColorStop(0.5, '#eef1f5'); k.addColorStop(1, '#5a616c');
  x.fillStyle = k; x.beginPath(); x.moveTo(cx, y - 2); x.lineTo(cx + R * 0.09, y + R * 0.14); x.lineTo(cx - R * 0.09, y + R * 0.14); x.closePath(); x.fill();
}

/** Chrome balloon sprites, one per env slide; shaded like the SEO word, 2D fallback without WebGL. */
function balloonSprites(R, slides) {
  const d = 2, W = R * 2 * d, H = Math.round(R * 2.5 * d);
  const flat = () => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.scale(d, d);
    const g = x.createRadialGradient(R * 0.65, R * 0.7, R * 0.05, R, R * 1.12, R);
    g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#aeb6c6'); g.addColorStop(1, `rgb(${BLUE.join(',')})`);
    x.fillStyle = g; x.beginPath(); x.ellipse(R, R * 1.12, R * 0.9, R * 1.08, 0, 0, TAU); x.fill();
    balloonKnot(x, R);
    return c;
  };
  const glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  const gl = glc.getContext('webgl', { antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) return slides.map(flat);
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn('balloon shader:', gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, CHROME_VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, BALLOON_FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(prog, 'uRes'), W, H);
  gl.uniform3f(gl.getUniformLocation(prog, 'uBlue'), BLUE[0] / 255, BLUE[1] / 255, BLUE[2] / 255);
  const uScroll = gl.getUniformLocation(prog, 'uScroll');
  gl.viewport(0, 0, W, H);
  const out = slides.map((s) => {
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uScroll, s); gl.drawArrays(gl.TRIANGLES, 0, 3);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.drawImage(glc, 0, 0); x.scale(d, d); balloonKnot(x, R);
    return c;
  });
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return out;
}

export function createBalloons(canvas, count = 14, seed = 11) {
  const st = fitCanvas(canvas);
  const R = 72, sprites = balloonSprites(R, [0, 0.9, 1.8, 2.7]), r = rng(seed);
  const list = Array.from({ length: count }, (_, i) => ({
    x: (i + 0.2 + r() * 0.6) / count, size: 0.55 + r() * 0.6, start: r() * 0.35,
    dur: 0.5 + r() * 0.15, phase: r() * TAU, wob: 0.6 + r() * 0.8, v: i % 4,
  })).sort((a, b) => a.size - b.size);
  return { render(p) {
    const { ctx: x, w, h } = st;
    x.clearRect(0, 0, w, h);
    if (p <= 0 || p >= 1) return;
    for (const b of list) {
      const t = (p - b.start) / b.dur;
      if (t <= 0 || t >= 1) continue;
      const s = Math.min(w, h * 1.6) * 0.042 * b.size, a = t * TAU * b.wob + b.phase;
      const bx = b.x * w + Math.sin(a) * s * 0.4;
      const by = h + s * 2.6 - t ** 1.15 * (h + s * 5.4);
      x.save(); x.translate(bx, by); x.rotate(Math.cos(a) * 0.08);
      x.globalAlpha = 0.7 + 0.3 * (b.size - 0.55) / 0.6;
      const ky = s * 1.38;
      x.beginPath(); x.moveTo(0, ky);
      x.bezierCurveTo(Math.sin(a + 1) * s * 0.3, ky + s * 0.8, Math.sin(a + 2) * s * -0.3, ky + s * 1.5, Math.sin(a + 3) * s * 0.2, ky + s * 2.3);
      x.lineWidth = Math.max(0.75, s / R); x.strokeStyle = 'rgba(232,236,246,.55)'; x.stroke();
      x.drawImage(sprites[b.v], -s, -s * 1.14, s * 2, s * 2.5);
      x.restore();
    }
  } };
}

let posterChrome = null;
export function drawChrome(ctx, w, h, opts = {}) {
  posterChrome ??= createChrome(document.createElement('canvas'), true);
  posterChrome.render(w, h, opts);
  ctx.drawImage(posterChrome.canvas, 0, 0, w, h);
}

/* ------------------------------------------------------------------
   Poster images for the chapters dialog (3:4 portrait, cover)
   ------------------------------------------------------------------ */
// Flat typographic poster (no 3D art): one big word on a solid surface
function wordPoster(x, W, H, bg, fg, word, fontFamily) {
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  x.fillStyle = fg; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  x.font = `400 100px ${fontFamily}`;
  const size = Math.min(W * 0.9 * 100 / x.measureText(word).width, H * 0.4);
  x.font = `400 ${size}px ${fontFamily}`;
  x.fillText(word, W * 0.06, H * 0.9);
}

export function makePosters(fontFamily) {
  const W = 540, H = 720;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const anam = createAnamorph();
  const out = [];
  const tmp = document.createElement('canvas');
  const draws = [
    () => { x.fillStyle = NIGHT; x.fillRect(0, 0, W, H); tmp.width = W; tmp.height = 260; anam(tmp.getContext('2d'), W, 260, 0, fontFamily); x.drawImage(tmp, 0, 220); },
    () => wordPoster(x, W, H, PAPER, '#202623', 'control.', fontFamily),
    () => drawPromise(x, W * 1.9, H, 3),
    () => { x.fillStyle = `rgb(${BLUE.join(',')})`; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 10; i++) { x.beginPath(); x.moveTo(i * W / 10, 0); x.lineTo(i * W / 10, H); x.moveTo(0, i * H / 10); x.lineTo(W, i * H / 10); x.stroke(); } const r = rng(5); x.lineWidth = 3; x.strokeStyle = '#fff'; x.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { const a = i % 2; x.beginPath(); x.arc((a ? .3 : .68) * W + (r() - .5) * 180, (a ? .7 : .35) * H + (r() - .5) * 200, 7, 0, TAU); a ? x.fill() : x.stroke(); } },
    () => drawScale(x, W * 2, H, 2),
    () => drawChrome(x, W, H, { fontFamily }),
    () => drawInterface(x, W, H, 1.3),
    () => wordPoster(x, W, H, NIGHT, '#f2f4f1', '2022.', fontFamily),
  ];
  for (const d of draws) {
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, W, H);
    d();
    out.push(c.toDataURL('image/webp', 0.82));
  }
  return out;
}
