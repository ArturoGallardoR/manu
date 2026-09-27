// Language: ?lang= wins, then the saved choice, then Spanish (the original copy).
const KEY = 'lang';
const LANGS = ['es', 'en'];
const store = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* private mode */ } },
};
const fromUrl = new URLSearchParams(location.search).get('lang');
export const lang = LANGS.includes(fromUrl) ? fromUrl : LANGS.includes(store.get()) ? store.get() : 'es';

export function setLang(next) {
  if (!LANGS.includes(next) || next === lang) return;
  store.set(next);
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', next);
    history.replaceState(history.state, '', url);
  }
  location.reload();
}

const UI = {
  es: {
    locale: 'es-MX',
    soundOn: 'Sonido sí', soundOff: 'Sonido no',
    motionOn: 'Movimiento sí', motionOff: 'Movimiento no',
    langSwitch: 'Ver el portafolio en inglés',
    promiseA: 'Una campaña con sustento.', promiseB: 'El 1.5% del Sell In, marca por marca.',
    whatIDid: 'Lo que hice',
    anamorphWord: 'TU MARCA.',
  },
  en: {
    locale: 'en-US',
    soundOn: 'Sound on', soundOff: 'Sound off',
    motionOn: 'Motion on', motionOff: 'Motion off',
    langSwitch: 'View the portfolio in Spanish',
    promiseA: 'A campaign with solid backing.', promiseB: '1.5% of Sell In, brand by brand.',
    whatIDid: 'What I did',
    anamorphWord: 'YOUR BRAND.',
  },
};
export const t = UI[lang];

// English for the static shell in index.html (Spanish is the markup default).
const STATIC_EN = {
  title: 'Manuel Azpeitia Martín · Marketer',
  description: 'Portfolio of Manuel Azpeitia Martín, marketer: case studies in trade marketing, budgeting, Google reputation and local SEO.',
  skip: 'Skip to content',
  navMain: 'Main',
  navCases: 'Cases', navCareer: 'Career', navProfile: 'Profile', navContact: 'Contact',
  footerCopy: 'Marketer. Trade marketing, budgeting and brand reputation.',
  cases: 'Cases', contact: 'Contact', education: 'Education', languages: 'Languages',
  eduMarketing: 'Marketing, UdeG', eduDesign: 'Graphic Design, UdeG', eduDigital: 'Digital Marketing, INDAGO',
  spanish: 'Spanish', english: 'English',
  controls: 'Controls', chapters: 'Chapters',
  explore: 'Explore the portfolio', close: 'Close',
  imagined: 'An imagined installation',
};

export function applyStatic(root = document) {
  document.documentElement.lang = lang === 'en' ? 'en' : 'es-MX';
  if (lang === 'es') return;
  document.title = STATIC_EN.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', STATIC_EN.description);
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = STATIC_EN[el.dataset.i18n] ?? el.textContent; });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', STATIC_EN[el.dataset.i18nAria] ?? el.getAttribute('aria-label')); });
}
