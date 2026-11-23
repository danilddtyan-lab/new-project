'use strict';

const kyrgyzRoutes = {
  road: {
    title:'Городское кольцо по Бишкеку',
    meta:'17 км · набор 160 м · преимущественно твёрдое покрытие',
    detail:'Кольцо из Октябрьского района с городскими улицами и велодорожкой. На отмеченных участках велосипед ведут пешком.',
    url:'https://www.komoot.com/smarttour/37049527', link:'Карта Komoot'
  },
  roadpacking: {
    title:'Сары-Могол — Дароот-Коргон',
    meta:'Алайская долина · около 61 км в одну сторону',
    detail:'Дорожный перегон между сёлами с видом на Заалайский хребет. Подходит как этап похода с ночёвкой, с отдельным планом возврата.',
    url:'https://kyrgyzmap.com/ru/route/sary-mogol-daroot-korgon-cycle-ru/', link:'Карта и GPX на KyrgyzMap'
  },
  gravel: {
    title:'Карагачёвая тропа',
    meta:'Бишкек · около 1,1 км · лёгкий грунтовый синглтрек',
    detail:'Короткий участок с небольшим перепадом высот. Подойдёт, чтобы проверить, как велосипед с багажом ведёт себя на узкой грунтовой тропе.',
    url:'https://www.trailforks.com/trails/karagachevaya-322508/', link:'Профиль тропы на Trailforks'
  },
  rough: {
    title:'Тропа к перевалу Электро',
    meta:'Иссык-Ата · около 2 км · MTB-синглтрек средней сложности',
    detail:'Пример узкой горной тропы. Для подбора сборки важны сцепление покрышек на грунте и устойчивость велосипеда с грузом.',
    url:'https://www.trailforks.com/trails/path-to-mountain-pass-elektro/', link:'Профиль тропы на Trailforks'
  },
  sand: {
    title:'Ак-Сай — Туз-Кёль',
    meta:'Около 21 км в одну сторону · сухие каньоны и берег',
    detail:'Маршрут через рыхлые участки южного берега Иссык-Куля. Это пример песчаного покрытия. Для обратной дороги авторы предлагают организовать трансфер.',
    url:'https://www.trailforks.com/route/salt-lake/', link:'Карта на Trailforks'
  }
};

const dayRoutes = [
  {...kyrgyzRoutes.road, surface:'road', start:'Бишкек, Октябрьский район'},
  {
    surface:'gravel', start:'Бишкек, вокзал Бишкек‑2',
    title:'Кольцо к смотровой у флагштока',
    meta:'38,4 км · набор 490 м · асфальт и грунт',
    detail:'Из города к предгорьям и обратно. Это более сложное кольцо с крутым участком. На отмеченном участке велосипед нужно вести пешком.',
    url:'https://www.komoot.com/smarttour/20163204', link:'Карта Komoot'
  }
];

const surface = document.querySelector('#fit-form select[name="surface"]');
const surfaceExample = document.getElementById('surface-example');
const surfacePlaceholder = surfaceExample?.innerHTML;
let selectedRouteExample;

function showSurfaceExample(route = kyrgyzRoutes[surface.value]) {
  selectedRouteExample = route;
  surfaceExample.innerHTML = route ? `<p class="meta">ПРИМЕР В КЫРГЫЗСТАНЕ</p>
    <h3>${route.title}</h3><p class="route-meta">${route.meta}</p>
    <p>${route.detail}</p><a href="${route.url}">${route.link}</a>` : surfacePlaceholder;
  document.getElementById('fit-result').hidden = true;
}

const now = new Date();
const timeZone = 'Asia/Bishkek';
const parts = new Intl.DateTimeFormat('en',{timeZone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now);
const date = Object.fromEntries(parts.map(({type,value}) => [type,value]));
const bishkekDay = Date.UTC(Number(date.year),Number(date.month)-1,Number(date.day)) / 86400000;
const featuredRoute = dayRoutes[bishkekDay % dayRoutes.length];

if (surface) {
  surface.addEventListener('change',() => showSurfaceExample());
  if (new URLSearchParams(location.search).has('day')) {
    surface.value = featuredRoute.surface;
    showSurfaceExample(featuredRoute);
  } else {
    const requestedSurface = new URLSearchParams(location.search).get('surface');
    if (Object.hasOwn(kyrgyzRoutes, requestedSurface)) surface.value = requestedSurface;
    if (surface.value) showSurfaceExample();
  }
}

const routeDayContent = document.getElementById('route-day-content');
if (routeDayContent) {
  document.getElementById('route-day-date').textContent = new Intl.DateTimeFormat('ru',{timeZone,day:'numeric',month:'long'}).format(now);
  routeDayContent.innerHTML = `<h3>${featuredRoute.title}</h3>
    <p class="route-meta">Старт: ${featuredRoute.start} · ${featuredRoute.meta}</p>
    <p>${featuredRoute.detail}</p>
    <p class="route-conditions">Перед выездом проверьте погоду и состояние дороги.</p>
    <div class="route-actions"><a href="${featuredRoute.url}">${featuredRoute.link}</a>
    <a class="outline" href="./selection.html?day=1">Подобрать велосипед</a></div>`;
}

const routesGrid = document.getElementById('routes-grid');
if (routesGrid) {
  const surfaces = {road:'Асфальт',roadpacking:'Дорожный байкпакинг',gravel:'Гравий',rough:'Камни и тропы',sand:'Песок и рыхлый грунт'};
  routesGrid.innerHTML = Object.entries(kyrgyzRoutes).map(([type,route]) =>
    `<article class="card"><p class="meta">${surfaces[type]}</p><h3>${route.title}</h3>
      <p class="route-meta">${route.meta}</p><p>${route.detail}</p><div class="route-actions"><a href="${route.url}">${route.link}</a><a href="./selection.html?surface=${type}">Подобрать сборку</a></div></article>`).join('');
}
