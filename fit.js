'use strict';

const get = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const byId = new Map(frames.map(frame => [frame.id,frame]));
const frameSpec = frame => frameDetails[frame.id]?.spec || frame.url;

const configurations = {
  road: {
    gearExample:'Shimano GRX RX820 2×12', tireExample:'Schwalbe Marathon Almotion',
    title:'Туринг для асфальта', models:['Seaboard/CX01','SHULZ/The Lightning','Poseidon/X'],
    gears:'Начните с 2×. Кассета с лёгкой передачей пригодится на подъёмах с багажом.',
    tires:'Гладкие или полуслики. Ориентир для новой сборки — 35–42 мм при подходящем клиренсе.'
  },
  roadpacking: {
    gearExample:'Shimano GRX RX820 2×12', tireExample:'Schwalbe Marathon Almotion',
    title:'Дорожный байкпакинг с багажом', models:['SHULZ/The Lightning','State Bicycle Co./4130 All-Road','Seaboard/CX01'],
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
get('fit-form').addEventListener('submit',event => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(event.currentTarget));
  const {route,height,weight,luggage,reuse} = recommend(input);
  const result = get('fit-result');
  const routeExample = selectedRouteExample || kyrgyzRoutes[input.surface];
  const models = route.models.map(id => {
    const frame = byId.get(id);
    return '<li><a href="'+escapeHtml(frameSpec(frame))+'">'+escapeHtml(frame.brand+' '+frame.model)+'</a></li>';
  }).join('');
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
    <p><a href="./fit-guide.html">Гайд по ростовке, выносу и рулю MTB-дропбара</a></p>
    <p class="result-route"><strong>Пример маршрута.</strong> <a href="${routeExample.url}">${routeExample.title}</a></p>
    <p><strong>Проверьте нагрузку.</strong> ${load} Сверьте полную массу с лимитами производителя велосипеда, рамы и колёс, а нагрузку на багажник — с его отдельным лимитом.</p>`;
  result.hidden = false;
  result.focus();
});
