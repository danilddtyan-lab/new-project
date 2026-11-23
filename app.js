'use strict';

const get = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const byId = new Map(frames.map(frame => [frame.id, frame]));
const collator = new Intl.Collator('ru');
const pageSize = 15;
let limit = pageSize;
let activeTerrain = '';
let savedOnly = false;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('veloburo.saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => byId.has(id)));
} catch {}
const compared = new Set();

get('total').textContent = frames.length;
get('brand-total').textContent = brands.length;
for (const [key, label] of Object.entries(material)) get('material').add(new Option(label,key));
for (const brand of brands.map(item => item[0]).sort(collator.compare)) get('brand').add(new Option(brand,brand));
get('tabs').innerHTML = Object.entries({'':'Все рамы',...terrain}).map(([key,label]) =>
  '<button type="button" data-terrain="'+key+'">'+label+'</button>').join('');

function render(event) {
  const focus = event?.target.closest?.('button[data-action]');
  const focusData = focus?.dataset;
  const filters = [get('q'), get('material'), get('brand'), get('sort')];
  const [query, frameMaterial, brand, sort] = filters.map(input => input.value.trim());
  const words = normalize(query).split(/\s+/);
  const matching = frames.filter(frame =>
    (!activeTerrain || activeTerrain === frame.t) &&
    (!frameMaterial || frameMaterial === frame.m) &&
    (!brand || brand === frame.brand) &&
    (!savedOnly || saved.has(frame.id)) &&
    words.every(word => normalize(frame.brand+' '+frame.model).includes(word)));
  if (sort !== 'featured') matching.sort((left,right) =>
    collator.compare(left.brand+' '+left.model,right.brand+' '+right.model) * (sort === 'az' ? 1 : -1));
  const visible = matching.slice(0,limit);
  get('count').textContent = 'Показано '+visible.length+' из '+matching.length;
  get('saved-count').textContent = saved.size;
  get('saved-toggle').setAttribute('aria-pressed',savedOnly);
  get('more').hidden = matching.length <= limit;
  get('reset').hidden = !(activeTerrain || savedOnly || query || frameMaterial || brand || sort !== 'featured');
  get('tabs').querySelectorAll('button').forEach(button =>
    button.setAttribute('aria-pressed',button.dataset.terrain === activeTerrain));
  get('grid').innerHTML = visible.map(frame => {
    const id = escapeHtml(frame.id);
    const selected = compared.has(frame.id);
    const starred = saved.has(frame.id);
    return `<article class="card">
      <p class="meta">${escapeHtml(frame.brand)}</p>
      <h3>${escapeHtml(frame.model)}</h3>
      <p>${material[frame.m]} · ${terrain[frame.t]}</p>
      <div class="card-actions">
        <button class="outline" type="button" data-action="save" data-frame="${id}" aria-label="В избранное: ${id}" aria-pressed="${starred}">${starred?'♥':'♡'}</button>
        <button class="outline" type="button" data-action="compare" data-frame="${id}" aria-label="В сравнение: ${id}" aria-pressed="${selected}" ${compared.size === 3 && !selected ? 'disabled' : ''}>${selected?'В сравнении':'Сравнить'}</button>
        <a href="${frame.url}" aria-label="Сайт производителя ${escapeHtml(frame.brand)}">Бренд</a>
      </div></article>`;
  }).join('') || '<p class="empty">Подходящих рам нет. Смените фильтры.</p>';
  get('compare-bar').hidden = !compared.size;
  get('compare-open').disabled = compared.size < 2;
  get('compare-count').textContent = 'Рам для сравнения: '+compared.size+' / 3';
  if (focusData) {
    const replacement = [...get('grid').querySelectorAll('button[data-action]')].find(button =>
      button.dataset.action === focusData.action && button.dataset.frame === focusData.frame);
    (replacement || get('saved-toggle')).focus({preventScroll:true});
  }
}
function refilter() {
  limit = pageSize;
  render();
}
for (const [name,event] of [['q','input'],['material','change'],['brand','change'],['sort','change']]) {
  get(name).addEventListener(event,refilter);
}
get('tabs').addEventListener('click',event => {
  const button = event.target.closest('button');
  if (!button) return;
  activeTerrain = button.dataset.terrain;
  refilter();
});
get('saved-toggle').addEventListener('click',() => {
  savedOnly = !savedOnly;
  refilter();
  get('catalog').scrollIntoView();
});
get('reset').addEventListener('click',() => {
  for (const field of ['q','material','brand']) get(field).value = '';
  get('sort').value = 'featured';
  activeTerrain = '';
  savedOnly = false;
  refilter();
});
get('more').addEventListener('click',() => {
  limit += pageSize;
  render();
});
get('grid').addEventListener('click',event => {
  const button = event.target.closest('button[data-action]');
  if (!button || !byId.has(button.dataset.frame)) return;
  const {action,frame} = button.dataset;
  if (action === 'save') {
    if (saved.has(frame)) saved.delete(frame);
    else saved.add(frame);
    try { localStorage.setItem('veloburo.saved',JSON.stringify([...saved])); } catch {}
  } else if (compared.has(frame)) compared.delete(frame);
  else if (compared.size < 3) compared.add(frame);
  render(event);
});
get('compare-clear').addEventListener('click',() => {
  compared.clear();
  render();
});
get('compare-open').addEventListener('click',() => {
  const columns = [...compared].map(id => byId.get(id));
  get('compare-content').innerHTML = '<div class="table-wrap"><table><thead><tr><th scope="col">Параметр</th>'+
    columns.map(frame => '<th scope="col">'+escapeHtml(frame.id.replace('/',' '))+'</th>').join('')+
    '</tr></thead><tbody>'+[
      ['Материал',frame => material[frame.m]],
      ['Назначение',frame => terrain[frame.t]],
      ['Сайт',frame => '<a href="'+frame.url+'">Производитель</a>']
    ].map(([label,value]) => '<tr><th scope="row">'+label+'</th>'+
      columns.map(frame => '<td>'+value(frame)+'</td>').join('')+'</tr>').join('')+
    '</tbody></table></div>';
  get('compare-dialog').showModal();
});

const configurations = {
  road: {
    gearExample:'Shimano GRX RX820 2×12', tireExample:'Schwalbe Marathon Almotion',
    title:'Туринг для асфальта', models:['Surly/Disc Trucker','Fairlight/Faran','Kona/Sutra'],
    gears:'Начните с 2×. Кассета с лёгкой передачей пригодится на подъёмах с багажом.',
    tires:'Гладкие или полуслики. Ориентир для новой сборки — 35–42 мм при подходящем клиренсе.'
  },
  gravel: {
    gearExample:'Shimano GRX RX820 1×12', tireExample:'Schwalbe G-One Bite',
    title:'Гравийник для смешанных дорог', models:['Ritchey/Outback','Fairlight/Secan','Bombtrack/Hook EXT'],
    gears:'1× с широким диапазоном для грунта или 2×, если много асфальта и важны небольшие шаги между передачами.',
    tires:'Мелкий центральный протектор и боковые грунтозацепы. Ориентир — 40–50 мм.'
  },
  rough: {
    gearExample:'Shimano Deore M6100 1×12', tireExample:'Schwalbe Nobby Nic',
    title:'Хардтейл для камней и троп', models:['Surly/Karate Monkey','Brother Cycles/Big Bro','Esker/Hayduke'],
    gears:'MTB 1× с широкой кассетой. При выборе звезды учитывайте крутизну подъёмов и вес багажа.',
    tires:'Выраженные грунтозацепы. Ориентир — 2,25–2,6″, в пределах допусков рамы и вилки.'
  },
  sand: {
    gearExample:'Shimano Deore M6100, если совместим с кареткой и чейнлайном', tireExample:'Schwalbe Jumbo Jim',
    title:'Фэтбайк для рыхлого покрытия', models:['Surly/Wednesday','Otso/Arctodus','Salsa/Beargrease'],
    gears:'MTB 1× с лёгкими передачами. Подберите систему под ширину каретки и чейнлайн фэтбайка.',
    tires:'Объёмные покрышки около 4–5″, если рама, вилка и обода рассчитаны на такой размер.'
  }
};

function recommend(input) {
  const route = configurations[input.surface];
  const height = Number(input.height);
  const size = height < 155 ? 'XXS–XS' : height < 165 ? 'XS–S' : height < 175 ? 'S–M' :
    height < 185 ? 'M–L' : height < 195 ? 'L–XL' : 'XL–XXL';
  const weight = Number(input.weight);
  const luggage = Number(input.luggage);
  const match = {
    road:['road','gravel'],gravel:['gravel','rough'],rough:['rough','sand'],sand:['sand']
  }[input.surface].includes(input.bike);
  const reuse = input.bike === 'none' ? 'Начните со сравнения готовых велосипедов и рам из списка.' :
    match ? 'Текущий тип велосипеда подходит для этого маршрута. Сначала проверьте, достаточно ли сменить покрышки или облегчить передачи.' :
      'Сравните клиренс, передачи и крепления текущего велосипеда с требованиями маршрута перед заменой рамы.';
  return {route,height,size,weight,luggage,reuse};
}
get('fit-form').addEventListener('submit',event => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(event.currentTarget));
  const {route,height,size,weight,luggage,reuse} = recommend(input);
  const result = get('fit-result');
  const models = route.models.map(id => {
    const frame = byId.get(id);
    return '<li><a href="'+frame.url+'">'+escapeHtml(frame.brand+' '+frame.model)+'</a></li>';
  }).join('');
  const load = input.luggage === '' ?
    'Вес велосипедиста '+weight.toLocaleString('ru')+' кг. Добавьте вес велосипеда, воды и всего багажа перед проверкой лимита нагрузки.' :
    'Велосипедист и багаж вместе весят '+(weight+luggage).toLocaleString('ru',{maximumFractionDigits:1})+
    ' кг. Добавьте массу велосипеда и всё, что не учли в багаже.';
  result.innerHTML = `<h3>${route.title}</h3>
    <p>${input.model.trim() ? 'Текущий велосипед: '+escapeHtml(input.model.trim())+'. ' : ''}${reuse}</p>
    <div class="result-grid">
      <article><h3>Рама</h3><p>При росте ${height} см начните с диапазона ${size}. Сверьте ростовку производителя, длину ноги и высоту верхней трубы.</p><ul>${models}</ul></article>
      <article><h3>Трансмиссия</h3><p>${route.gears} Сверьте барабан, каретку и совместимость манеток, переключателя и кассеты.</p><p class="example">Пример: ${route.gearExample}.</p></article>
      <article><h3>Покрышки</h3><p>${route.tires} Сверьте посадочный диаметр, ширину обода и зазор в раме и вилке.</p><p class="example">Пример: ${route.tireExample}.</p></article>
    </div>
    <p><strong>Проверьте нагрузку.</strong> ${load} Сверьте полную массу с лимитами производителя велосипеда, рамы и колёс, а нагрузку на багажник — с его отдельным лимитом.</p>`;
  result.hidden = false;
  result.focus();
});
render();
