'use strict';

const get = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const byId = new Map(frames.map(frame => [frame.id, frame]));
const collator = new Intl.Collator('ru');
const pageSize = 15;
const plurals = new Intl.PluralRules('ru');
const wordForm = (count, one, few, many) => ({one, few, many})[plurals.select(count)] || many;
let limit = pageSize;
let activeTerrain = '';
let activeCollection = '';
let savedOnly = false;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('veloburo.saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => byId.has(id)));
} catch {}
const compared = new Set();
const collectionButtons = [...document.querySelectorAll('[data-collection]')];
const catalogPriority = new Map(Object.keys(frameDetails).filter(id => frameDetails[id].pick).map((id,index) => [id,index]));
const frameSpec = frame => frameSpecs[frame.id]?.source || frameDetails[frame.id]?.spec || framePhotos.get(frame.id)?.spec || frame.url;

get('photos-only').checked = new URLSearchParams(location.search).has('photos');
get('total').textContent = frames.length;
get('brand-total').textContent = brands.length;
get('model-label').textContent = wordForm(frames.length,'модель','модели','моделей');
get('brand-label').textContent = wordForm(brands.length,'бренд','бренда','брендов');
for (const [key, label] of Object.entries(material)) get('material').add(new Option(label,key));
for (const brand of brands.map(item => item[0]).sort(collator.compare)) get('brand').add(new Option(brand,brand));
const requestedBrand = new URLSearchParams(location.search).get('brand');
if (brands.some(([brand]) => brand === requestedBrand)) get('brand').value = requestedBrand;
get('tabs').innerHTML = Object.entries({'':'Все рамы',...terrain}).map(([key,label]) =>
  '<button type="button" data-terrain="'+key+'">'+label+'</button>').join('');

function frameWeight(spec) {
  if (!spec?.weightG) return 'Нет данных';
  const tolerance = spec.toleranceG ? ' ± '+spec.toleranceG : '';
  return spec.weightG+tolerance+' г'+(spec.weightBasis ? ' ('+escapeHtml(spec.weightBasis)+')' : '');
}

function frameClearance(spec) {
  if (spec?.frontMm || spec?.rearMm) {
    const note = spec.clearanceNote ? ' · '+escapeHtml(spec.clearanceNote) : '';
    return 'Перед '+(spec.frontMm ? spec.frontMm+' мм' : '—')+' · зад '+(spec.rearMm ? spec.rearMm+' мм' : '—')+note;
  }
  return spec?.clearanceMm ? 'До '+spec.clearanceMm+' мм, общий допуск' : 'Нет данных';
}

function render(event) {
  const focus = event?.target.closest?.('button[data-action]');
  const focusData = focus?.dataset;
  const filters = [get('q'), get('material'), get('brand'), get('region'), get('sort')];
  const [query, frameMaterial, brand, region, sort] = filters.map(input => input.value.trim());
  const photosOnly = get('photos-only').checked;
  const clearance = Math.max(Number(get('clearance').value), activeTerrain === 'G' ? 45 : 0);
  const words = normalize(query).split(/\s+/);
  const matching = frames.filter(frame =>
    (!activeTerrain || activeTerrain === frame.t) &&
    (!clearance || (frameSpecs[frame.id]?.clearanceMm ?? 0) >= clearance) &&
    (!activeCollection || frameDetails[frame.id]?.pick === activeCollection) &&
    (!frameMaterial || frameMaterial === frame.m) &&
    (!brand || brand === frame.brand) &&
    (!region || region === frame.region) &&
    (!savedOnly || saved.has(frame.id)) &&
    (!photosOnly || framePhotos.has(frame.id)) &&
    words.every(word => normalize(frame.brand+' '+frame.model).includes(word)));
  if (sort !== 'featured') matching.sort((left,right) =>
    collator.compare(left.brand+' '+left.model,right.brand+' '+right.model) * (sort === 'az' ? 1 : -1));
  else matching.sort((left,right) =>
    (frameSpecs[right.id]?.current === true ? 1 : frameSpecs[right.id]?.current === false ? -1 : 0) -
    (frameSpecs[left.id]?.current === true ? 1 : frameSpecs[left.id]?.current === false ? -1 : 0) ||
    (catalogPriority.get(left.id) ?? catalogPriority.size) - (catalogPriority.get(right.id) ?? catalogPriority.size));
  const visible = matching.slice(0,limit);
  get('count').textContent = 'Показано '+visible.length+' из '+matching.length;
  get('saved-count').textContent = saved.size;
  get('saved-toggle').setAttribute('aria-pressed',savedOnly);
  get('more').hidden = matching.length <= limit;
  get('reset').hidden = !(activeTerrain || activeCollection || savedOnly || query || frameMaterial || brand || region || clearance || photosOnly || sort !== 'featured');
  get('tabs').querySelectorAll('button').forEach(button =>
    button.setAttribute('aria-pressed',button.dataset.terrain === activeTerrain));
  for (const button of collectionButtons) button.setAttribute('aria-pressed',button.dataset.collection === activeCollection);
  const groups = {CN:'Китайские бренды', EU:'Европейские бренды', RU:'Российские бренды', OTHER:'Другие бренды'};
  const groupCards = Object.entries(groups).map(([regionKey,label]) => {
    const group = visible.filter(frame => frame.region === regionKey);
    if (!group.length) return '';
    return '<h3 class="group-heading">'+label+'</h3>'+group.map(frame => {
    const details = frameDetails[frame.id];
    const spec = frameSpecs[frame.id];
    const id = escapeHtml(frame.id);
    const selected = compared.has(frame.id);
    const starred = saved.has(frame.id);
    return `<article class="card">
      ${renderFramePhoto(frame.id)}
      <p class="meta">${escapeHtml(frame.brand)}</p>
      <h3 tabindex="-1">${escapeHtml(frame.model)}</h3>
      <p>${material[frame.m]} · ${terrain[frame.t]}${regionNames[frame.region] ? ' · '+regionNames[frame.region] : ''}</p>
      <dl class="frame-facts">
        <div><dt>Вес рамы</dt><dd>${frameWeight(spec)}</dd></div>
        <div><dt>Покрышка 700C</dt><dd>${frameClearance(spec)}</dd></div>
      </dl>
      ${details?.note ? `<p>${escapeHtml(details.note)}</p>` : ''}
      ${details?.price ? `<p class="catalog-price">${escapeHtml(details.price)} <span>по прайсу производителя</span></p>` : ''}
      <div class="card-actions">
        <button class="outline" type="button" data-action="save" data-frame="${id}" aria-label="В избранное: ${id}" aria-pressed="${starred}">${starred?'♥':'♡'}</button>
        <button class="outline" type="button" data-action="compare" data-frame="${id}" aria-label="В сравнение: ${id}" aria-pressed="${selected}" ${compared.size === 3 && !selected ? 'disabled' : ''}>${selected?'В сравнении':'Сравнить'}</button>
        <a href="${escapeHtml(frameSpec(frame))}" aria-label="Сайт производителя ${escapeHtml(frame.brand)}">${(spec?.source || details?.spec || framePhotos.get(frame.id)?.spec) ? 'Характеристики' : 'Бренд'}</a>
      </div>${renderMarketLink(frame.id)}</article>`;
    }).join('');
  }).join('');
  get('grid').innerHTML = groupCards || '<p class="empty">Подходящих рам нет. Смените фильтры.</p>';
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
for (const [name,event] of [['q','input'],['material','change'],['brand','change'],['region','change'],['clearance','change'],['photos-only','change'],['sort','change']]) {
  get(name).addEventListener(event,refilter);
}
get('tabs').addEventListener('click',event => {
  const button = event.target.closest('button');
  if (!button) return;
  activeTerrain = button.dataset.terrain;
  refilter();
});
for (const button of collectionButtons) button.addEventListener('click',() => {
  activeCollection = button.dataset.collection;
  refilter();
});
function clearFilters() {
  for (const field of ['q','material','brand','region','clearance']) get(field).value = '';
  get('sort').value = 'featured';
  get('photos-only').checked = false;
  activeTerrain = '';
  activeCollection = '';
}
get('saved-toggle').addEventListener('click',() => {
  savedOnly = !savedOnly;
  if (savedOnly) clearFilters();
  refilter();
  get('catalog').scrollIntoView();
});
get('reset').addEventListener('click',() => {
  clearFilters();
  savedOnly = false;
  refilter();
  get('q').focus();
});
get('more').addEventListener('click',() => {
  const previous = new Set([...get('grid').querySelectorAll('[data-action=save]')].map(button => button.dataset.frame));
  limit += pageSize;
  render();
  [...get('grid').querySelectorAll('[data-action=save]')].find(button => !previous.has(button.dataset.frame))?.closest('.card').querySelector('h3').focus();
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
  get('q').focus();
});
get('compare-open').addEventListener('click',() => {
  const columns = [...compared].map(id => byId.get(id));
  get('compare-content').innerHTML = '<div class="table-wrap"><table><thead><tr><th scope="col">Параметр</th>'+
    columns.map(frame => '<th scope="col">'+escapeHtml(frame.id.replace('/',' '))+'</th>').join('')+
    '</tr></thead><tbody>'+[
      ['Вес рамы',frame => frameWeight(frameSpecs[frame.id])],
      ['Покрышка 700C',frame => frameClearance(frameSpecs[frame.id])],
      ['Материал',frame => material[frame.m]],
      ['Назначение',frame => terrain[frame.t]],
      ['Регион бренда',frame => regionNames[frame.region] || 'Другие регионы'],
      ['Сайт',frame => '<a href="'+escapeHtml(frameSpec(frame))+'">Производитель</a>']
    ].map(([label,value]) => '<tr><th scope="row">'+label+'</th>'+
      columns.map(frame => '<td>'+value(frame)+'</td>').join('')+'</tr>').join('')+
    '</tbody></table></div>';
  get('compare-dialog').showModal();
});

render();
