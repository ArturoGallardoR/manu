import './fold.css';
// Fold reveal: a sheet folded once down its centre, opening like a book (after the
// iPhone Duo "display" film). geometry (foldPose) → presentation (css vars) → content (sliced clones)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const DEG = Math.PI / 180;
/** CSS-style cubic-bezier easing, solved by bisection (robust for steep curves). */
export function cubicBezier(x1, y1, x2, y2) {
  const B = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 22; i++) { t = (lo + hi) / 2; if (B(x1, x2, t) < x) lo = t; else hi = t; }
    return B(y1, y2, t);
  };
}
const OPEN = cubicBezier(0.5, 0, 0.15, 1);
const SLIDE = cubicBezier(0.35, 0, 0.55, 1);
const PLEAT_MAX = 0.2;
/**
 * Pose of the sheet at progress p ∈ [0, 1], in three beats measured off the reference:
 * lift (hinge eases off the stack, light sweeps the cover) → swing (the leaf arcs toward
 * the viewer while the sheet re-centres and grows to full bleed) → settle (a hair past flat, back).
 */
/**
 * Pose of the sheet at progress p ∈ [0, 1], in the beats measured off the reference film:
 * notch (the crease on the folded packet deepens) → swing (the leaf arcs open toward the
 * viewer while the sheet re-centres and grows to full bleed) → pleat (the second fold, a soft
 * tuck, travels from the hinge out past the right edge, leaving the cloth stretched flat).
 */
export function foldPose(p, { lift = 10, settle = 2.5, inset = 0.86, radius = 24 } = {}) {
  const a = clamp(p / 0.1), b = clamp((p - 0.06) / 0.36), c = clamp((p - 0.34) / 0.6);
  const swing = OPEN(b), grow = OPEN(clamp((p - 0.06) / 0.5));
  return {
    fold: (180 - lift * smooth(a)) * (1 - swing) - settle * Math.sin(Math.PI * clamp((b - 0.75) / 0.25)),
    notch: smooth(a) * (1 - swing),
    sheen: clamp(a * 0.7 + b * 0.6),
    pleat: SLIDE(c),
    pleatOn: clamp(swing * 1.6 - 0.6) * (1 - smooth(clamp((c - 0.86) / 0.14))),
    pleatWidth: 0.07 + 0.13 * Math.sin(Math.PI * Math.min(1, 0.15 + c * 0.85)),
    scale: inset + (1 - inset) * grow,
    radius: radius * (1 - grow),
  };
}
/**
 * createFoldReveal(root, options) wraps root's children in a sheet folded down its centre.
 * progress 0 = folded (half width, centred), 1 = flat full bleed. Drive with setProgress() or play().
 */
export function createFoldReveal(root, {
  duration = 1800,
  perspective = 3,
  lift = 10,
  settle = 2.5,
  inset = 0.86,
  radius = 24,
  className = '',
} = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('fold', ...className.split(' ').filter(Boolean));
  const content = document.createElement('div');
  content.className = 'fold__content';
  content.append(...root.childNodes);
  const el = (cls, ...kids) => { const n = document.createElement('div'); n.className = cls; n.append(...kids); return n; };
  const slice = () => {
    const clone = content.cloneNode(true);
    clone.className = 'fold__clone';
    clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    return el('fold__slice', clone);
  };
  const rightSlice = slice(), leftSlice = slice();
  const right = el('fold__half fold__half--r', rightSlice);
  const front = el('fold__face fold__face--front', leftSlice);
  const back = el('fold__face fold__face--back', el('fold__cover'));
  const leaf = el('fold__leaf', front, back);
  const pleat = el('fold__pleat');
  const sheet = el('fold__sheet', right, leaf, el('fold__crease'), pleat);
  sheet.setAttribute('aria-hidden', 'true');
  sheet.inert = true;
  root.append(sheet, content);
  let W = 0, progress = -1, raf = 0;
  function render() {
    const flat = progress >= 1;
    root.classList.toggle('is-flat', flat);
    if (flat || !W) return;
    const pose = foldPose(progress, { lift, settle, inset, radius });
    const { fold, sheen, scale, radius: r } = pose;
    const f = fold * DEG, w = W / 2;
    // centre the visible footprint: the stacked half while closed, the whole sheet once open
    const off = fold >= 90 ? w / 2 : (w * (1 - Math.cos(f))) / 2;
    sheet.style.transform = `translateX(${(-off * scale).toFixed(2)}px) scale(${scale.toFixed(4)})`;
    leaf.style.transform = `translateZ(${(2 * clamp(fold / 180)).toFixed(2)}px) rotateY(${fold.toFixed(3)}deg)`;
    const s = Math.abs(Math.sin(f));
    root.style.setProperty('--fold-r', `${(r / scale).toFixed(2)}px`);
    root.style.setProperty('--fold-tilt', s.toFixed(3));
    root.style.setProperty('--fold-cast', (fold > 0 ? s : 0).toFixed(3));
    root.style.setProperty('--fold-sheen', `${(120 - sheen * 140).toFixed(1)}%`);
    root.style.setProperty('--fold-crease', (0.04 + 0.3 * s).toFixed(3));
    root.style.setProperty('--fold-notch', pose.notch.toFixed(3));
    // the second fold: a tuck gliding from the hinge out past the right edge
    const reach = w + PLEAT_MAX * W;
    pleat.style.transform = `translate3d(${(pose.pleat * reach - (PLEAT_MAX * W) / 2).toFixed(2)}px,0,4px) scaleX(${(pose.pleatWidth / PLEAT_MAX).toFixed(4)})`;
    pleat.style.opacity = pose.pleatOn.toFixed(3);
  }
  function layout() {
    W = root.clientWidth;
    root.style.setProperty('--fold-perspective', `${Math.round(W * perspective)}px`);
    for (const [s, x] of [[rightSlice, -W / 2], [leftSlice, 0]]) {
      s.style.width = `${W}px`;
      s.style.transform = `translateX(${x}px)`;
    }
    render();
  }
  const ro = new ResizeObserver(layout);
  ro.observe(root);
  function setProgress(p) {
    const next = clamp(p);
    if (next === progress) return;
    progress = next;
    render();
  }
  function play({ from = progress, to = 1, duration: d = duration } = {}) {
    cancelAnimationFrame(raf);
    if (reduced.matches) { setProgress(to); return Promise.resolve(); }
    return new Promise((done) => {
      const t0 = performance.now(), span = Math.abs(to - from) * d || 1;
      const tick = (now) => {
        const k = clamp((now - t0) / span);
        setProgress(from + (to - from) * k);
        if (k < 1) raf = requestAnimationFrame(tick); else done();
      };
      raf = requestAnimationFrame(tick);
    });
  }
  function destroy() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    root.replaceChildren(...content.childNodes);
    root.classList.remove('fold', 'is-flat');
  }
  layout();
  setProgress(0);
  return { setProgress, play, destroy, get progress() { return progress; } };
}
