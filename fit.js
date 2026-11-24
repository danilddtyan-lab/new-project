'use strict';

const get = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const byId = new Map(frames.map(frame => [frame.id,frame]));
const frameSpec = frame => frameDetails[frame.id]?.spec || frame.url;

const configurations = {
  road: {
    gearExample:'Shimano GRX RX820 2×12', tireExample:'Schwalbe Marathon Almotion',
    title:'Туринг для асфальта', models:['Seaboard/CX01','SHULZ/The Lightning','Poseidon/X','Canyon/Grizl AL'],
    gears:'Начните с 2×. Кассета с лёгкой передачей пригодится на подъёмах с багажом.',
    tires:'Гладкие или полуслики. Ориентир для новой сборки — 35–42 мм при подходящем клиренсе.'
  },
  roadpacking: {
    gearExample:'Shimano GRX RX820 2×12', tireExample:'Schwalbe Marathon Almotion',
    title:'Дорожный байкпакинг с багажом', models:['SHULZ/The Lightning','State Bicycle Co./4130 All-Road','Seaboard/CX01','Fairlight/Secan'],
    gears:'Для длинных перегонов и подъёмов с грузом рассмотрите 2×. Подберите лёгкую нижнюю передачу под крутизну маршрута.',
    tires:'Туристические полуслики с защитой от проколов. Ориентир — 38–45 мм с запасом под крылья, если они нужны.'
  },
  gravel: {
    gearExample:'Shimano GRX RX820 1×12', tireExample:'Schwalbe G-One Bite',
    title:'Гравийник для смешанных дорог', models:['Twitter/G2 MAX','Seaboard/GR02','SPCycle/G028'],
    gears:'1× с широким диапазоном для грунта или 2×, если много асфальта и важны небольшие шаги между передачами.',
    tires:'Мелкий центральный протектор и боковые грунтозацепы. Ориентир — 40–50 мм.'
  },
  rough: {
    gearExample:'Shimano Deore M6100 1×12', tireExample:'Schwalbe Nobby Nic',
    title:'Хардтейл для камней и троп', models:['State Bicycle Co./4130 Trail','TanTan Seraph/FM529','Marin/Pine Mountain'],
    gears:'MTB 1× с широкой кассетой. При выборе звезды учитывайте крутизну подъёмов и вес багажа.',
    tires:'Выраженные грунтозацепы. Ориентир — 2,25–2,6″, в пределах допусков рамы и вилки.'
  },
  sand: {
    gearExample:'Shimano Deore M6100, если совместим с кареткой и чейнлайном', tireExample:'Schwalbe Jumbo Jim',
    title:'Фэтбайк для рыхлого покрытия', models:['Trek/Farley','Salsa/Mukluk','Surly/Wednesday'],
    gears:'MTB 1× с лёгкими передачами. Подберите систему под ширину каретки и чейнлайн фэтбайка.',
    tires:'Объёмные покрышки около 4–5″, если рама, вилка и обода рассчитаны на такой размер.'
  }
};

function recommend(input) {
  const route = configurations[input.surface];
  const height = Number(input.height);
  const weight = Number(input.weight);
  const luggage = Number(input.luggage);
  const match = {
    road:['road','gravel'],roadpacking:['road','gravel'],gravel:['gravel','rough'],rough:['rough','sand'],sand:['sand']
  }[input.surface].includes(input.bike);
  const reuse = input.bike === 'none' ? 'Начните со сравнения готовых велосипедов и рам из списка.' :
    match ? 'Текущий тип велосипеда подходит для этого маршрута. Сначала проверьте, достаточно ли сменить покрышки или облегчить передачи.' :
      'Сравните клиренс, передачи и крепления текущего велосипеда с требованиями маршрута перед заменой рамы.';
  return {route,height,weight,luggage,reuse};
}
const bikeFitForm = get('fit-form');
for (const preset of fitPresets) {
  const button = document.createElement('button');
  button.className = 'outline';
  button.type = 'button';
  button.textContent = preset.title;
  button.addEventListener('click', () => {
    for (const [key,value] of Object.entries(preset.values)) bikeFitForm.elements[key].value = value;
    bikeFitForm.elements.surface.dispatchEvent(new Event('change'));
    get('preset-status').textContent = 'Сценарий «'+preset.title+'» применён.';
    if (bikeFitForm.checkValidity()) bikeFitForm.requestSubmit();
  });
  get('fit-presets').append(button);
}
bikeFitForm.addEventListener('submit',event => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(event.currentTarget));
  const {route,height,weight,luggage,reuse} = recommend(input);
  const result = get('fit-result');
  const routeExample = selectedRouteExample || kyrgyzRoutes[input.surface];
  const candidates = input.surface === 'gravel' ? [...new Set([...route.models, ...Object.keys(frameSpecs).filter(id => byId.get(id)?.t === 'G')])] : route.models;
  const models = candidates.filter(id => {
    const spec = frameSpecs[id];
    const sizeMatches = !spec?.sizes || spec.sizes.some(([min,max]) => height >= min && height <= max);
    return sizeMatches && (!input.tire || (spec?.clearanceMm ?? 0) >= Number(input.tire))
      && (!input.budget || (spec?.kitUsd ?? Infinity) <= Number(input.budget)*(input.budgetCurrency === 'KGS' ? 1/priceRates.USD : 1));
  }).map(id => {
    const frame = byId.get(id);
    const spec = frameSpecs[id];
    const size = spec?.sizes?.find(([min,max]) => height >= min && height <= max);
    const facts = [size && 'ростовка '+size[2],spec?.clearanceMm && 'до '+spec.clearanceMm+' мм (700C)',spec?.kitUsd && dualPrice([spec.kitUsd],'USD')+' по источнику'].filter(Boolean);
    return '<li><a href="'+escapeHtml(spec?.source || frameSpec(frame))+'">'+escapeHtml(frame.brand+' '+frame.model)+'</a>'+ (facts.length ? ' · '+facts.join(' · ') : '') +'</li>';
  }).join('') || '<li>Среди моделей с известными параметрами совпадений нет. Проверьте допуски и цену у производителя.</li>';
  const distanceTip = Number(input.distance) >= 100 ? 'Для 100 км и больше проверьте удобство нескольких хватов и доступ к воде с багажом.' : '';
  const inseamTip = input.inseam ? 'Сравните standover производителя с длиной ноги '+Number(input.inseam)+' см и проверьте запас при сходе с седла.' : '';
  const load = input.luggage === '' ?
    'Вес велосипедиста '+weight.toLocaleString('ru')+' кг. Добавьте вес велосипеда, воды и всего багажа перед проверкой лимита нагрузки.' :
    'Велосипедист и багаж вместе весят '+(weight+luggage).toLocaleString('ru',{maximumFractionDigits:1})+
    ' кг. Добавьте массу велосипеда и всё, что не учли в багаже.';
  result.innerHTML = `<h3>${route.title}</h3>
    <p>${input.model.trim() ? 'Текущий велосипед: '+escapeHtml(input.model.trim())+'. ' : ''}${reuse}</p>
    <div class="result-grid">
      <article><h3>Рама</h3><p>Для роста ${height} см найдите размер в таблице конкретной рамы. Сверьте длину ноги, standover и диапазон высоты седла.</p><ul>${models}</ul></article>
      <article><h3>Трансмиссия</h3><p>${route.gears} Сверьте барабан, каретку и совместимость манеток, переключателя и кассеты.</p><p class="example">Пример: ${route.gearExample}.</p></article>
      <article><h3>Покрышки</h3><p>${route.tires} Сверьте посадочный диаметр, ширину обода и зазор в раме и вилке.</p><p class="example">Пример: ${route.tireExample}.</p></article>
    </div>
    <p>${[fitGuidance[input.style],distanceTip,inseamTip].filter(Boolean).join(" ")}</p>
    <p><a href="./fit-guide.html">Гайд по ростовке, выносу и рулю MTB-дропбара</a></p>
    <p><a href="./catalog.html">Сравнить рамы</a> · <a href="./gear.html#tires">Каталог покрышек</a> · <a href="./gear.html#bags">Каталог сумок</a></p>
    <p class="result-route"><strong>Пример маршрута.</strong> <a href="${routeExample.url}">${routeExample.title}</a></p>
    <p><strong>Проверьте нагрузку.</strong> ${load} Сверьте полную массу с лимитами производителя велосипеда, рамы и колёс, а нагрузку на багажник — с его отдельным лимитом.</p>`;
  result.hidden = false;
  result.focus();
});
