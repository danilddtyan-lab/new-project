'use strict';

const homeDate = new Intl.DateTimeFormat('ru',{timeZone:'UTC'});
const homeTerms = {
  UDH:'Универсальный сменный держатель заднего переключателя.',
  T47:'Резьбовой стандарт каретки с диаметром резьбы 47 мм.',
  'BSA 68':'Английская резьба каретки для стакана шириной 68 мм.',
  Boost:'Стандарт ширины втулок: 110 мм спереди и 148 мм сзади.',
  'Flat Mount':'Плоское крепление дискового тормоза.',
  'Micro Spline':'Барабан кассеты Shimano с 23 шлицами, в том числе под звезду на 10 зубьев.',
  HG:'Семейство кассет и барабанов Shimano Hyperglide. Сверьте конкретную версию.',
  '15×100':'Сквозная передняя ось диаметром 15 мм для втулки шириной 100 мм.'
};

function homeElement(tag,text,className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function homeTechText(element,text) {
  const terms = new RegExp('('+Object.keys(homeTerms).join('|')+')','g');
  for (const piece of text.split(terms)) {
    if (!Object.hasOwn(homeTerms,piece)) {
      element.append(piece);
      continue;
    }
    const term = homeElement('a',piece,'tech-term');
    term.href = './glossary/#'+piece.toLowerCase().replaceAll(' ','-').replace('×','x');
    term.title = homeTerms[piece];
    element.append(term);
  }
}

function homeExternal(url,label) {
  const link = homeElement('a',label+' ↗');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label',label+' (внешний сайт)');
  return link;
}

function homeList(values) {
  const list = homeElement('ul');
  list.append(...values.map(value => homeElement('li',value)));
  return list;
}

function homeBuildCard(build) {
  const article = homeElement('article','', 'card build-card');
  article.append(photoPlaceholder(build.id,build.category,build.title),
    homeElement('h3',build.title),homeElement('p',build.model,'meta'),
    homeElement('strong',dualPrice(build.price,build.currency)));
  article.append(homeElement('h4','Что входит'));
  const includes = homeElement('ul');
  for (const component of build.includes) {
    const row = homeElement('li');
    row.append(homeElement('strong',component.label+'. '));
    homeTechText(row,component.description);
    includes.append(row);
  }
  const compatibility = homeElement('p');
  homeTechText(compatibility,build.compatibility);
  const links = homeElement('div','','product-links');
  links.append(...build.links.map(link => homeExternal(link.url,link.label)));
  article.append(includes,compatibility,links);
  return article;
}

fetch('./data/builds.json',{cache:'no-cache'})
  .then(response => {
    if (!response.ok) throw new Error('Builds unavailable');
    return response.json();
  })
  .then(data => {
    const date = iso => homeDate.format(new Date(iso+'T00:00:00Z'));
    const prices = 'Цены на '+date(data.priceDate)+(data.pricesVerified ? ', проверены вручную.' : ', ориентировочные.');
    document.getElementById('home-trust').textContent = prices+' Данные обновлены '+date(data.updated)+'.';
    const rate = homeExternal(priceRates.source,'Курс НБКР');
    const note = homeElement('p','','meta');
    note.append(rate,' · '+priceRates.USD.toLocaleString('ru')+' сом за 1 USD на '+priceRates.date+'.');
    const grid = homeElement('div','','build-card-grid');
    grid.append(...data.builds.map(homeBuildCard));
    document.getElementById('builds-content').replaceChildren(
      homeElement('h3','Что докупить'),homeList(data.extras),note,grid);
    const frames = data.tideace.map(frame => {
      const card = homeElement('article','','card');
      const specs = homeElement('p');
      homeTechText(specs,frame.spec);
      card.append(photoPlaceholder(frame.id,'Рамы'),homeElement('h3',frame.title),specs,homeElement('strong',dualPrice(frame.priceUsd,'USD')),homeElement('p','Характеристики сверены '+date(frame.checked),'meta'),homeExternal(frame.url,'Подробнее'));
      return card;
    });
    document.getElementById('tideace-grid').replaceChildren(...frames);
  })
  .catch(() => {
    document.getElementById('builds-content').textContent = 'Сборки не загрузились. Индивидуальный подбор доступен по ссылке ниже.';
    document.getElementById('tideace-grid').textContent = 'Характеристики не загрузились. Откройте каталог рам.';
  });
