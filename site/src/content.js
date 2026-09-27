// Page content + templates. Copy adapted from casos-de-exito-manuel.md and the CV
// (see ../copy-sitio.md for the editable source of every text on the page).
// Every text exists in Spanish (original) and English; `lang` picks one at load.

import { lang } from './i18n.js';
import logoRadial from './assets/empresas/radial.png';
import logoCimeira from './assets/empresas/cimeira.png';
import logoInspira from './assets/empresas/inspira.png';
import logoIdit from './assets/empresas/idit.png';

const companyLogos = (i, logos) => `<span class="companyLogos" data-q-logos="${i}" aria-hidden="true">${logos.map(([src, w, h]) => `<img src="${src}" alt="" width="${w}" height="${h}" decoding="async">`).join('')}</span>`;
const brandFiles = import.meta.glob('./assets/marcas/*.png', { eager: true, import: 'default' });
const BRANDS = [['pirelli', 'Pirelli'], ['bridgestone', 'Bridgestone'], ['goodyear', 'Goodyear'], ['firestone', 'Firestone'], ['cooper', 'Cooper Tires'], ['hankook', 'Hankook'], ['toyo', 'Toyo Tires']];
const brandLogos = (hidden) => BRANDS.map(([f, name]) => `<img src="${brandFiles[`./assets/marcas/${f}.png`]}" alt="${hidden ? '' : name}"${hidden ? ' aria-hidden="true"' : ''} width="890" height="150">`).join('');

export const person = {
  name: 'Manuel Azpeitia Martín',
  role: lang === 'en' ? 'Marketer' : 'Mercadólogo',
  email: 'azpeitia698@gmail.com',
  phone: '+523471180838',
  linkedin: 'https://www.linkedin.com/in/jesus-manuel-azpeitia-martin/',
};

const CHAPTERS = {
  es: [
    {
      id: 'el-perfil', n: '01', name: 'El perfil', where: 'Mercadólogo',
      thesis: 'Marketing que se nota y se puede medir.',
      body: 'Soy mercadólogo y tengo más de tres años de experiencia en trade marketing, contenido y desarrollo de marca. Desde octubre de 2023 trabajo en mercadotecnia para una red de 96 puntos de venta. Hago los reportes de gasto del área y los de desempeño por marca, cuido la imagen de cada punto de venta y administro los perfiles de Google de toda la red. Antes hice contenido para YouTube y redes sociales, y diseñé modelos de negocio. Me gusta el trabajo que se puede comprobar: una calificación que sube y un presupuesto que cuadra.',
      archive: ['Formación'],
      events: [
        ['2023', 'Licenciatura en Mercadotecnia, Universidad de Guadalajara'],
        ['2023', 'Diploma en Diseño Gráfico, Universidad de Guadalajara'],
        ['2024', 'Diploma en Marketing Digital, INDAGO'],
        ['2025', 'Curso de Figma, impartido por Lashmith Alcalá'],
        ['2026', 'Excel: Análisis y dashboards, A2 Capacitación'],
      ],
    },
    {
      id: 'el-control', n: '02', name: 'El control', where: '',
      thesis: 'Todo lo que sale del departamento queda registrado.',
      body: 'El material de mercadotecnia se controlaba por escrito. No había forma de saber qué se mandaba a cada sucursal, cuándo llegaba ni quién lo recibía, y nadie tenía una cuenta real de existencias. Generé una hoja de control de guías de envío con la fecha de salida, la fecha de llegada y el nombre de quien recibe en cada punto de venta, y desde entonces todo lo que sale del departamento tiene respaldo. Para el material promocional armé un inventario por SKU. Para el material que se solicita para activaciones en puntos de venta, hice un calendario donde cada pieza tiene su estatus (disponible, en uso o inhabilitado), quién la solicitó y dónde se encuentra.',
      archive: ['En la hoja', 'Qué se registra'],
      events: [
        ['Guía', 'Fecha de salida, fecha de llegada y quién recibe'],
        ['SKU', 'Entradas y salidas de promocionales'],
        ['Agenda', 'Control de solicitudes de material publicitario para activaciones en punto de venta'],
      ],
    },
    {
      id: 'el-presupuesto', n: '03', name: 'El presupuesto', where: 'Co-patrocinios',
      thesis: 'Con un método claro apareció el dinero que se quedaba sobre la mesa.',
      body: 'Cuando llegué al departamento, el presupuesto y los ingresos por co-patrocinio de las marcas se calculaban sin un método claro, y se dejaba dinero sobre la mesa. Armé en Excel un modelo que parte del 1.5% del Sell In total que la compañía le compra a cada marca. Con eso el presupuesto se puede seguir por marca y por trimestre, y nos dimos cuenta de que perdíamos entre 800 mil y un millón de pesos por periodo que no se aprovechaban. Con esto aumentamos la visibilidad de nuestros co-patrocinadores en cada campaña.',
      archive: ['En números', 'Por periodo'],
      events: [
        ['1.5%', 'Del Sell In de cada marca, como base del co-patrocinio'],
        ['+800 mil', 'Pesos adicionales por periodo, y hasta un millón'],
        ['Trimestre', 'Presupuesto trazable por marca y por trimestre'],
      ],
    },
    {
      id: 'la-reputacion', n: '04', name: 'La reputación', where: 'Google My Business',
      thesis: 'De 3.5 a 4.7 estrellas en toda la red.',
      body: 'Una ventana nacional de promociones generó un aumento excepcional en la demanda que terminó afectando la experiencia de cliente. La calificación promedio de una red de sucursales cayó de 4.2 a 3.5 estrellas. Diseñé una estrategia de recuperación enfocada en aumentar la participación de clientes y simplificar el proceso de dejar una reseña después de su visita. Implementamos tarjetas con NFC y códigos QR en los puntos de venta, apoyándonos en herramientas especializadas para gestionar y dar seguimiento a las reseñas. Con esta estrategia, el volumen mensual de reseñas pasó de alrededor de 200 a más de 3,000 y la calificación promedio de la red alcanzó 4.7 estrellas.',
      archive: ['En números', 'Calificación promedio'],
      stars: true,
      events: [
        ['4.2', 'Antes del periodo promocional'],
        ['3.5', 'Después del pico de demanda'],
        ['4.7', 'Tras implementar la estrategia en toda la red'],
      ],
    },
    {
      id: 'la-escala', n: '05', name: 'La escala', where: '96 puntos de venta',
      thesis: 'Un modelo para que las marcas financien el espacio que ocupan.',
      body: 'Las marcas tenían presencia publicitaria en 96 puntos de venta, pero el mantenimiento de esos espacios salía del presupuesto de la compañía. Inventarié cada espacio, sus medidas y su estado, y reuní todo en un solo documento. Con esa información armé un modelo de cobro por metro cuadrado que permite que el propio espacio publicitario ayude a financiar su mantenimiento. La compañía puede reducir ese gasto y, al mismo tiempo, mantener una mejor presentación en sus puntos de venta.',
      archive: ['En números', 'Un solo documento'],
      events: [
        ['96', 'Puntos de venta inventariados en un solo lugar'],
        ['m²', 'Base para calcular el cobro de cada espacio publicitario'],
      ],
    },
    {
      id: 'el-contexto', n: '06', name: 'El contexto', where: 'SEO local',
      thesis: 'Dos años seguidos en el Top 10 de SEO local en Latinoamérica.',
      body: 'Codirigí una estrategia de SEO local para toda la red. Con Partoo como aliado, optimizamos los perfiles de Google My Business de nuestros puntos de venta y conseguimos posicionar a la empresa entre las 10 marcas con mejor SEO local de Latinoamérica durante dos años consecutivos.',
      archive: ['En números', 'SEO local'],
      events: [
        ['Estrategia', 'SEO local a escala de toda la red'],
        ['Resultado', 'Top 10 en Latinoamérica durante dos años consecutivos'],
      ],
    },
    {
      id: 'la-apertura', n: '07', name: 'La apertura', where: 'Nuevos puntos de venta',
      thesis: 'Cada nueva apertura, de la ejecución física al lanzamiento.',
      body: 'Participé en la apertura de nuevos puntos de venta desde la parte física hasta el día de inauguración. Coordinaba proveedores para fachadas, letreros, anuncios luminosos y otros elementos del espacio, cuidando que cada ejecución respetara los lineamientos de la marca. También coordinaba el lanzamiento de cada ubicación: campañas en medios tradicionales, agencias BTL, proveedores, catering y la logística del evento de apertura.',
      archive: ['En cada apertura', 'Mi participación'],
      events: [
        ['Espacio físico', 'Fachadas, letreros, anuncios luminosos y elementos visuales'],
        ['Marca', 'Supervisión de la ejecución y consistencia del branding'],
        ['Lanzamiento', 'Campañas en medios tradicionales y comunicación de apertura'],
        ['Inauguración', 'Agencias BTL, proveedores, catering y logística del evento'],
      ],
    },
    {
      id: 'la-trayectoria', n: '08', name: 'La trayectoria', where: 'Desde 2022',
      thesis: 'Empecé haciendo contenido. Hoy trabajo en el trade marketing de una red de puntos de venta.',
      body: 'Mi primer trabajo fue en IDIT PYME, con gráficos para Meta Business Suite y textos para redes. En Inspira Ideas que Unen pasé a foto, video, miniaturas y Shorts para YouTube. En Cimeira diseñé modelos de negocio, reestructuré los que ya existían y armé campañas de marketing tradicional y digital. En Radial Llantas junté todo eso con la operación: proveedores, pantallas de digital signage, material POP y aperturas. Trabajo bien en equipo, soy organizado y puntual, y me gusta la parte creativa del trabajo. Hablo español e inglés.',
      archive: ['Habilidades', 'Además de lo anterior'],
      events: [
        ['SEO', 'SEO local y Google My Business'],
        ['Diseño', 'Diseño gráfico, retoque y edición de video'],
        ['Idiomas', 'Español e inglés'],
      ],
    },
  ],
  en: [
    {
      id: 'el-perfil', n: '01', name: 'The profile', where: 'Marketer',
      thesis: 'Marketing you can see and measure.',
      body: "I'm a marketer with more than three years of experience in trade marketing, content and brand development. Since October 2023 I've worked in marketing for a network of 96 points of sale. I prepare the department's spending reports and the performance reports for each brand, look after the image of every point of sale and manage the Google profiles for the whole network. Before that I made content for YouTube and social media, and designed business models. I like work you can verify: a rating that goes up and a budget that adds up.",
      archive: ['Education'],
      events: [
        ['2023', 'B.A. in Marketing, University of Guadalajara'],
        ['2023', 'Diploma in Graphic Design, University of Guadalajara'],
        ['2024', 'Diploma in Digital Marketing, INDAGO'],
        ['2025', 'Figma course, taught by Lashmith Alcalá'],
        ['2026', 'Excel: Analysis and dashboards, A2 Capacitación'],
      ],
    },
    {
      id: 'el-control', n: '02', name: 'The control', where: '',
      thesis: 'Everything that leaves the department is on record.',
      body: "Marketing materials were tracked on paper. There was no way to know what went out to each branch, when it arrived or who received it, and nobody had a real stock count. I created a shipping log with the ship date, the arrival date and the name of the person who receives it at each point of sale, and since then everything that leaves the department is backed up. For promotional items I set up an inventory by SKU. For the materials requested for in-store activations, I built a calendar where each piece has a status (available, in use or out of service), who requested it and where it is.",
      archive: ['On the sheet', 'What gets logged'],
      events: [
        ['Waybill', 'Ship date, arrival date and who receives it'],
        ['SKU', 'Promotional items in and out'],
        ['Calendar', 'Tracking requests for advertising materials for in-store activations'],
      ],
    },
    {
      id: 'el-presupuesto', n: '03', name: 'The budget', where: 'Co-sponsorships',
      thesis: 'A clear method surfaced the money we were leaving on the table.',
      body: "When I joined the department, the budget and the co-sponsorship income from brands were calculated without a clear method, and money was being left on the table. I built an Excel model based on 1.5% of the total Sell In the company buys from each brand. With it, the budget can be tracked by brand and by quarter, and we realized we were leaving between 800,000 and one million pesos unused each period. With this, we increased our co-sponsors' visibility in every campaign.",
      archive: ['By the numbers', 'Per period'],
      events: [
        ['1.5%', "Of each brand's Sell In, as the basis for co-sponsorship"],
        ['+800K', 'Additional pesos per period, up to one million'],
        ['Quarter', 'Budget traceable by brand and by quarter'],
      ],
    },
    {
      id: 'la-reputacion', n: '04', name: 'The reputation', where: 'Google My Business',
      thesis: 'From 3.5 to 4.7 stars across the network.',
      body: "A nationwide promotional window drove an exceptional spike in demand that ended up hurting the customer experience. The average rating of a branch network fell from 4.2 to 3.5 stars. I designed a recovery strategy focused on getting more customers involved and making it easier to leave a review after their visit. We placed NFC cards and QR codes at the points of sale and relied on specialized tools to manage and follow up on reviews. With this strategy, monthly reviews went from around 200 to more than 3,000, and the network's average rating reached 4.7 stars.",
      archive: ['By the numbers', 'Average rating'],
      stars: true,
      events: [
        ['4.2', 'Before the promotional period'],
        ['3.5', 'After the demand spike'],
        ['4.7', 'After rolling out the strategy across the network'],
      ],
    },
    {
      id: 'la-escala', n: '05', name: 'The scale', where: '96 points of sale',
      thesis: 'A model for brands to pay for the space they take up.',
      body: "Brands had advertising presence in 96 points of sale, but the upkeep of those spaces came out of the company's budget. I inventoried every space, its measurements and its condition, and put it all in a single document. With that information I built a per-square-meter pricing model so the advertising space itself helps pay for its upkeep. The company can cut that expense and, at the same time, keep its points of sale looking better.",
      archive: ['By the numbers', 'One document'],
      events: [
        ['96', 'Points of sale inventoried in one place'],
        ['m²', 'Basis for pricing each advertising space'],
      ],
    },
    {
      id: 'el-contexto', n: '06', name: 'The context', where: 'Local SEO',
      thesis: 'Two years in a row in the Top 10 for local SEO in Latin America.',
      body: 'I co-led a local SEO strategy for the whole network. With Partoo as our partner, we optimized the Google My Business profiles of our points of sale and placed the company among the 10 brands with the best local SEO in Latin America for two consecutive years.',
      archive: ['By the numbers', 'Local SEO'],
      events: [
        ['Strategy', 'Local SEO across the entire network'],
        ['Result', 'Top 10 in Latin America for two consecutive years'],
      ],
    },
    {
      id: 'la-apertura', n: '07', name: 'The opening', where: 'New points of sale',
      thesis: 'Every new opening, from the build-out to the launch.',
      body: 'I took part in opening new points of sale, from the physical build-out to opening day. I coordinated suppliers for facades, signs, illuminated signs and other elements of the space, making sure each job followed the brand guidelines. I also coordinated the launch of each location: traditional media campaigns, BTL agencies, suppliers, catering and the logistics of the opening event.',
      archive: ['At each opening', 'My role'],
      events: [
        ['Physical space', 'Facades, signs, illuminated signs and visual elements'],
        ['Brand', 'Supervising execution and branding consistency'],
        ['Launch', 'Traditional media campaigns and opening announcements'],
        ['Opening day', 'BTL agencies, suppliers, catering and event logistics'],
      ],
    },
    {
      id: 'la-trayectoria', n: '08', name: 'The career', where: 'Since 2022',
      thesis: 'I started out making content. Today I work in trade marketing for a network of points of sale.',
      body: "My first job was at IDIT PYME, making graphics for Meta Business Suite and copy for social media. At Inspira Ideas que Unen I moved on to photo, video, thumbnails and Shorts for YouTube. At Cimeira I designed business models, restructured existing ones and put together traditional and digital marketing campaigns. At Radial Llantas I brought all of that together with operations: suppliers, digital signage screens, POP materials and openings. I work well in a team, I'm organized and punctual, and I enjoy the creative side of the job. I speak Spanish and English.",
      archive: ['Skills', 'Beyond the above'],
      events: [
        ['SEO', 'Local SEO and Google My Business'],
        ['Design', 'Graphic design, retouching and video editing'],
        ['Languages', 'Spanish and English'],
      ],
    },
  ],
};
export const chapters = CHAPTERS[lang];

// Texts of the exhibition template, by language
const STRINGS = {
  es: {
    outOf5: (y) => `${y} de 5 estrellas`,
    readDoor: 'Hablemos de este caso',
    note1: 'Mercadólogo.<br>Trade marketing y growth.', note2: 'Desde 2022<br>Portafolio y casos.',
    h1: `${person.name}, mercadólogo`, titleLast: 'Mercadólogo',
    openingLead: 'Trade marketing para<br>una red de 96 puntos de venta.<br><span>Estos son algunos casos.</span>',
    begin: 'Ver los casos',
    intro: 'Introducción', portfolioOf: 'Portafolio de',
    drum: [
      ['Cap. 02 · El control', 'Controlé entradas y salidas', 'de material publicitario.'],
      ['Cap. 03 · El presupuesto', 'Optimicé el presupuesto', 'de co-patrocinios.'],
      ['Cap. 06 · El contexto', 'Mejoré la estrategia', 'de SEO local.'],
    ],
    prologueNote: 'Son tres de los seis casos de este portafolio, cada uno con el capítulo donde se cuenta.<br>Empieza por el perfil o elige un caso en Capítulos.',
    goFirst: 'Ir al capítulo uno',
    anamH2: 'Como mercadólogo, posiciono tu marca.', anamLead: 'Como mercadólogo, posiciono',
    anamQuestion: 'Presupuesto, imagen, material<br>y reputación de cada punto de venta.',
    the: { m: 'El', f: 'La' },
    controlWord: 'control.', budgetWord: 'presupuesto.', reputationWord: 'reputación.',
    ruptureQuestion: '¿Cuánto dinero se estaba quedando sobre la mesa?',
    ruptureSmall: 'Co-patrocinios de marca',
    repQuestion: '¿Cómo te recuperas después de una caída a 3.5 estrellas?',
    repInvite: 'Recorre lo que pasó', repLabel: 'La calificación de la red', moment: 'Momento',
    before: 'Antes de la estrategia', after: 'Después de la estrategia',
    run: 'Colocar las tarjetas NFC y QR →', reset: 'Reiniciar',
    plate: 'Calificación y reseñas de la red',
    legendDots: '● 10 reseñas al mes', legendStars: '★ Calificación promedio',
    statRating: 'Calificación promedio', statReviews: 'Reseñas al mes',
    plateNote: 'Cada punto representa unas 10 reseñas al mes. Las cifras son las del caso; el dibujo es una ilustración.',
    scaleH2: 'La escala: 96 puntos de venta.',
    scaleQuestion: '¿Cómo cuidas un punto de venta sin gastar un peso?', scaleSub: 'Cada metro cuadrado tiene precio.',
    scaleCaption: '96 puntos de venta, un solo documento.', imagined: 'Una instalación imaginada',
    contextH2: 'El contexto.',
    contextLead: 'Cada búsqueda local tiene una intención. La estrategia empezó por entender qué debía responder cada perfil para tener más posibilidades de aparecer.',
    organic: 'Una estrategia orgánica',
    shutterA: 'Antes', shutterB: 'de una...', destination: '¡Apertura!',
    openingH2: 'La apertura.', openingQuestion: '¿Qué necesita un punto de venta nuevo antes de abrir?',
    careerH2: 'La trayectoria.', forkTitle: 'Dónde<br>he estado.', pickStage: 'Elige una etapa.', pickStageAria: 'Elige una etapa',
    inspiraIdit: 'Inspira e IDIT Pyme',
    ending: ['Crezcamos', 'juntos.'],
    email: 'Escríbeme.', call: 'Llámame.', connect: 'Conectemos.',
    backToCases: 'Vuelve a los casos.', seeCases: 'Ver los casos',
    whereWorked: 'Dónde he trabajado.', seeCareer: 'Ver la trayectoria',
  },
  en: {
    outOf5: (y) => `${y} out of 5 stars`,
    readDoor: "Let's talk about this case",
    note1: 'Marketer.<br>Trade marketing and growth.', note2: 'Since 2022<br>Portfolio and cases.',
    h1: `${person.name}, marketer`, titleLast: 'Marketer',
    openingLead: 'Trade marketing for<br>a network of 96 points of sale.<br><span>Here are some of the cases.</span>',
    begin: 'See the cases',
    intro: 'Introduction', portfolioOf: 'Portfolio of',
    drum: [
      ['Ch. 02 · The control', 'I tracked what came in and out', 'of advertising materials.'],
      ['Ch. 03 · The budget', 'I optimized the budget', 'for co-sponsorships.'],
      ['Ch. 06 · The context', 'I improved the strategy', 'for local SEO.'],
    ],
    prologueNote: "These are three of the six cases in this portfolio, each with the chapter where it's told.<br>Start with the profile or pick a case in Chapters.",
    goFirst: 'Go to chapter one',
    anamH2: 'As a marketer, I position your brand.', anamLead: 'As a marketer, I position',
    anamQuestion: 'Budget, image, materials<br>and reputation for every point of sale.',
    the: { m: 'The', f: 'The' },
    controlWord: 'control.', budgetWord: 'budget.', reputationWord: 'reputation.',
    ruptureQuestion: 'How much money was being left on the table?',
    ruptureSmall: 'Brand co-sponsorships',
    repQuestion: 'How do you recover after dropping to 3.5 stars?',
    repInvite: 'Walk through what happened', repLabel: "The network's rating", moment: 'Moment',
    before: 'Before the strategy', after: 'After the strategy',
    run: 'Place the NFC and QR cards →', reset: 'Reset',
    plate: 'Network rating and reviews',
    legendDots: '● 10 reviews a month', legendStars: '★ Average rating',
    statRating: 'Average rating', statReviews: 'Reviews a month',
    plateNote: 'Each dot stands for about 10 reviews a month. The figures come from the case; the drawing is an illustration.',
    scaleH2: 'The scale: 96 points of sale.',
    scaleQuestion: 'How do you look after a point of sale without spending a peso?', scaleSub: 'Every square meter has a price.',
    scaleCaption: '96 points of sale, one document.', imagined: 'An imagined installation',
    contextH2: 'The context.',
    contextLead: 'Every local search has an intent. The strategy started by understanding what each profile needed to answer to have a better chance of showing up.',
    organic: 'An organic strategy',
    shutterA: 'Before', shutterB: 'an...', destination: 'Opening!',
    openingH2: 'The opening.', openingQuestion: 'What does a new point of sale need before it opens?',
    careerH2: 'The career.', forkTitle: "Where<br>I've been.", pickStage: 'Pick a stage.', pickStageAria: 'Pick a stage',
    inspiraIdit: 'Inspira and IDIT Pyme',
    ending: ["Let's grow", 'together.'],
    email: 'Email me.', call: 'Call me.', connect: "Let's connect.",
    backToCases: 'Back to the cases.', seeCases: 'See the cases',
    whereWorked: "Where I've worked.", seeCareer: 'See my career',
  },
};
const S = STRINGS[lang];
export const companyNames = ['Radial Llantas', 'Cimeira', S.inspiraIdit];

const arrow = '↗';

function meta(c, light = false) {
  return `<div class="chapterMeta${light ? ' chapterMeta--paper' : ''}"><span><span>${c.n} / 08</span><span class="metaName">${c.name}</span></span>${c.where ? `<span>${c.where}</span>` : ''}</div>`;
}

function readingRoom(c) {
  const archive = c.events
    ? `<div class="archive" data-reveal>
        <p>${c.archive[0]}${c.archive[1] ? ` <span>${c.archive[1]}</span>` : ''}</p>
        <ul>${c.events.map(([y, t]) => c.stars
            ? `<li class="eventRow eventRow--stars"><span class="eventYear"><span class="stars" style="--r:${y}" role="img" aria-label="${S.outOf5(y)}"></span>${y}</span><span class="eventText">${t}</span></li>`
            : `<li class="eventRow"><span class="eventYear">${y}</span><span class="eventText">${t}</span></li>`).join('')}</ul>
      </div>`
    : '';
  return `
  <div class="readingRoom" data-surface="paper">
    <div class="chapterSummary">
      <span class="chapterIndex" data-reveal>${c.n} · ${c.name}</span>
      <p class="understands" data-reveal>${c.thesis}</p>
      <a class="readDoor" href="#contacto" data-reveal>${S.readDoor} <span aria-hidden="true">${arrow}</span></a>
    </div>
    <div class="chapterMain">
      <p data-reveal>${c.body}</p>
      ${archive}
    </div>
  </div>`;
}

const [q, r, p, e, s, cx, i, ch] = chapters;

export const exhibitionHTML = `
<section class="opening" data-surface="paper" aria-label="${person.name}">
  <div class="heroPanel" data-surface="blue" aria-hidden="true"></div>
  <div class="openingNote"><span>${S.note1}</span><span>${S.note2}</span></div>
  <h1 class="visuallyHidden">${S.h1}</h1>
  <div class="title titleFirst" aria-hidden="true">Manuel<span>Azpeitia<br>Martín</span></div>
  <div class="title titleLast" aria-hidden="true">${S.titleLast}</div>
  <div class="openingBottom">
    <p>${S.openingLead}</p>
    <a class="begin" href="#${q.id}"><span class="beginText">${S.begin}</span> <span class="beginArrow" aria-hidden="true">↘</span></a>
  </div>
</section>

<section class="prologue" aria-label="${S.intro}" data-surface="paper" data-prologue>
  <div class="prologueFrame">
    <p class="prologueSide">${S.portfolioOf}<br>${person.name}</p>
    <div class="prologueMain">
      <div class="prologueCopy" aria-live="off">
        <div class="drum">
          ${S.drum.map(([ref, a, b]) => `<p class="drumLine"><span class="drumRef">${ref}</span>${a}</p><p class="drumLine is-accent">${b}</p>`).join('\n          ')}
        </div>
      </div>
      <p class="prologueNote">${S.prologueNote}</p>
    </div>
    <a class="prologueLink" href="#${q.id}" aria-label="${S.goFirst}">↓</a>
  </div>
</section>

<!-- 01 -->
<section class="chapter" id="${q.id}" data-chapter="0">
  <div class="anamorphTrack" data-anamorph-track>
  <div class="anamorphStage" data-surface="carbon">
    ${meta(q)}
    <h2 class="visuallyHidden">${S.anamH2}</h2>
    <p class="anamorphLead" aria-hidden="true">${S.anamLead}</p>
    <canvas class="anamorphCanvas" data-anamorph aria-hidden="true"></canvas>
    <p class="anamorphQuestion" data-reveal>${S.anamQuestion}</p>
  </div>
  </div>
  ${readingRoom(q)}
</section>

<!-- 02 -->
<section class="chapter" id="${r.id}" data-chapter="1">
  <div class="labStage" data-surface="paper">
    ${meta(r, true)}
    <div class="labIntro">
      <h2><span>${S.the.m}</span> <span>${S.controlWord}</span></h2>
    </div>
    <div class="controlArt" aria-hidden="true"><div class="controlPanel" data-control data-surface="blue"><canvas></canvas></div></div>
  </div>
  ${readingRoom(r)}
</section>

<!-- 03 -->
<section class="chapter" id="${p.id}" data-chapter="2">
  <div class="ruptureTrack" data-rupture>
    <div class="sceneStage rupture" data-surface="carbon">
      <div class="sceneArt"><div class="promiseGradient" aria-hidden="true"></div></div>
      ${meta(p)}
      <h2 class="fractureTitle">
        <span class="fractureThe">${S.the.m}</span>
        <span class="fractureWord"><span class="fractureWhole">${S.budgetWord}</span><canvas class="fractureSpores" aria-hidden="true"></canvas></span>
      </h2>
      <p class="ruptureQuestion">${S.ruptureQuestion}</p>
      <div class="ruptureState"><span data-promise-state></span><small>${S.ruptureSmall}</small></div>
      <div class="ruptureBar" aria-hidden="true"><i></i></div>
    </div>
  </div>
  <div class="brandMarquee" data-surface="paper"><div class="brandTrack">${brandLogos(false)}${brandLogos(true)}${brandLogos(true)}${brandLogos(true)}</div></div>
  ${readingRoom(p)}
</section>

<!-- 04 -->
<section class="chapter" id="${e.id}" data-chapter="3">
  <div class="labStage learningStage" data-surface="paper">
    ${meta(e, true)}
    <div class="labIntro">
      <h2><span>${S.the.f}</span> <span>${S.reputationWord}</span></h2>
      <p>${S.repQuestion}</p>
      <div class="labInvitation">${S.repInvite} <span aria-hidden="true">${arrow}</span></div>
    </div>
    <div class="labInstrument" data-learn>
      <div class="instrumentHead"><h3 class="label">${S.repLabel}</h3><p class="counter" data-learn-counter>Google My Business</p></div>
      <div class="learnTabs">
        <div role="group" aria-label="${S.moment}">
          <button class="tab" type="button" data-moment="0" aria-pressed="true">${S.before}</button>
          <button class="tab" type="button" data-moment="1" aria-pressed="false">${S.after}</button>
        </div>
      </div>
      <div class="learnActions">
        <button class="runButton" type="button" data-run>${S.run}</button>
        <button class="textButton" type="button" data-learn-reset>${S.reset}</button>
      </div>
      <canvas class="plate" data-plate role="img" aria-label="${S.plate}"></canvas>
      <div class="legend"><span>${S.legendDots}</span><span>${S.legendStars}</span></div>
      <div class="stats" aria-hidden="true">
        <div><span>${S.statRating}</span><strong data-acc>3.5</strong></div>
        <div><span>${S.statReviews}</span><strong data-steps>200</strong></div>
      </div>
      <p class="readout small" role="status" data-learn-status></p>
      <p class="note">${S.plateNote}</p>
    </div>
  </div>
  ${readingRoom(e)}
</section>

<!-- 05 -->
<section class="chapter" id="${s.id}" data-chapter="4">
  <div class="scaleJourney" data-scale>
    <div class="scaleFrame" data-surface="carbon">
      <div class="sceneArt"><canvas data-scene="scale"></canvas></div>
      <div class="scaleStencil" aria-hidden="true"><span>96.</span></div>
      ${meta(s)}
      <h2 class="visuallyHidden">${S.scaleH2}</h2>
      <div class="scaleCopy"><p>${S.scaleQuestion}</p><span>${S.scaleSub}</span></div>
      <div class="sceneCaption"><span>${S.scaleCaption}</span><span>${S.imagined}</span></div>
    </div>
  </div>
  ${readingRoom(s)}
</section>

<!-- 06 -->
<section class="chapter" id="${cx.id}" data-chapter="5">
  <div class="contextStage" data-surface="blue">
    ${meta(cx)}
    <div class="contextIntro">
      <h2 data-reveal>${S.contextH2}</h2>
      <p data-reveal>${S.contextLead}</p>
    </div>
    <div class="wordWorld">
      <canvas data-bank aria-hidden="true"></canvas>
      <p class="meaning">${S.organic}</p>
    </div>
  </div>
  ${readingRoom(cx)}
</section>

<!-- 07 -->
<section class="chapter" id="${i.id}" data-chapter="6">
  <div class="interfaceTrack" data-interface>
    <div class="stage portal" data-surface="carbon" style="--opening:0">
      <div class="art split" data-split aria-hidden="true"><div class="split__blue"></div><div class="split__shade"></div><canvas class="split__balloons"></canvas><div class="split__doors"><div class="split__door split__door--l"></div><div class="split__door split__door--r"></div></div></div>
      <div class="shutter shutterL"><span><span>${S.shutterA}</span><span>${S.shutterB}</span></span></div>
      <div class="destination" aria-hidden="true"><span>${S.destination}</span></div>
      ${meta(i)}
      <h2 class="visuallyHidden">${S.openingH2}</h2>
      <div class="interfaceCopy"><p>${S.openingQuestion}</p></div>
    </div>
  </div>
  ${readingRoom(i)}
</section>

<!-- 08 -->
<section class="chapter" id="${ch.id}" data-chapter="7">
  <div class="choicesStage" data-surface="carbon">
    ${meta(ch)}
    <h2 class="visuallyHidden">${S.careerH2}</h2>
    <div class="fork" data-fork>
      <div class="forkIntro">
        <p class="forkTitle">${S.forkTitle}</p>
        <span>${S.pickStage}</span>
      </div>
      <div class="forkTabs" role="group" aria-label="${S.pickStageAria}">
        <button type="button" data-q="0" aria-pressed="true"><b class="tabName visuallyHidden">${companyNames[0]}</b><span class="tabArrow" aria-hidden="true">${arrow}</span>${companyLogos(0, [[logoRadial, 608, 200]])}</button>
        <button type="button" data-q="1" aria-pressed="false"><b class="tabName visuallyHidden">${companyNames[1]}</b><span class="tabArrow" aria-hidden="true">${arrow}</span>${companyLogos(1, [[logoCimeira, 906, 240]])}</button>
        <button type="button" data-q="2" aria-pressed="false"><b class="tabName visuallyHidden">${companyNames[2]}</b><span class="tabArrow" aria-hidden="true">${arrow}</span>${companyLogos(2, [[logoInspira, 127, 105], [logoIdit, 193, 200]])}</button>
      </div>
      <div class="response" data-response></div>
    </div>
  </div>
  <div class="ending" id="contacto" data-surface="blue">
    <p><span>${S.ending[0]}</span><span>${S.ending[1]}</span></p>
    <div>
      <a href="mailto:${person.email}">${S.email}<span>${person.email} ${arrow}</span></a>
      <a href="tel:${person.phone}">${S.call}<span>+52 347 118 0838 ${arrow}</span></a>
      <a href="${person.linkedin}" target="_blank" rel="noopener noreferrer">${S.connect}<span>LinkedIn ${arrow}</span></a>
      <a href="#${r.id}">${S.backToCases}<span>${S.seeCases} ${arrow}</span></a>
      <a href="#${ch.id}">${S.whereWorked}<span>${S.seeCareer} ${arrow}</span></a>
    </div>
  </div>
</section>
`;
