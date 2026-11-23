'use strict';

const gearRoot = document.getElementById('gear-sections');
const gearIds = new Set(gearRoot.dataset.section.split(/\s+/));
const gearRequested = gearSections.filter(section => gearIds.has(section.id));

function gearCard([brand,name,use,detail,url,storeImage], shop = false) {
  const image = storeImage || gearPhotos[brand+'/'+name];
  return [
    '<article class="card">',
    image ? '<figure class="frame-photo gear-photo"><img alt="'+brand+' '+name+'" src="'+image+
      '" width="720" height="480" loading="lazy" decoding="async" referrerpolicy="no-referrer"></figure>' : '',
    '<p class="meta">'+brand+' · '+use+'</p><h3>'+name+'</h3><p>'+detail+'</p>',
    '<div class="product-links">'+(url ? '<a href="'+url+'">'+(shop ? 'Карточка FreeTour' : 'Источник')+'</a>' : '<span>Ссылка на спецификацию уточняется</span>'),
    shop ? '' : renderMarketLink(brand+'/'+name),'</div></article>'
  ].join('');
}

function renderGearSection({id,title,caption,items}) {
  const isBagCatalog = id === 'bags';
  const shop = isBagCatalog
    ? '<section class="freetour-bags" id="freetour-bags" aria-labelledby="freetour-bags-title">'+
      '<h3 id="freetour-bags-title">Сумки в FreeTour</h3>'+
      '<p>Цена и наличие указаны в карточке магазина.</p><div class="grid">'+
      freeTourBags.map(item => gearCard(item,true)).join('')+'</div></section>'
    : '';
  const label = isBagCatalog ? 'Все сумки' : 'Все модели';
  const available = isBagCatalog ? [...freeTourBags,...items] : items;
  const search = id === 'bags' || id === 'tires'
    ? '<label class="gear-filter">Бренд или модель<input type="search"></label>' : '';
  const filterLabel = {bags:'Крепление',tires:'Покрытие'}[id] || 'Назначение';
  return '<section class="gear gear-catalog" id="'+id+'" aria-labelledby="'+id+'-title">'+
    '<h2 id="'+id+'-title">'+title+'</h2><p class="standfirst">'+caption+'</p>'+search+
    '<label class="gear-filter">'+filterLabel+'<select><option value="">'+label+'</option>'+
    [...new Set(available.map(item => item[2]))].map(use => '<option>'+use+'</option>').join('')+
    '</select></label><p class="statusline" role="status"></p>'+shop+
    '<div class="grid">'+items.map(item => gearCard(item)).join('')+'</div></section>';
}

gearRoot.innerHTML = gearRequested.map(renderGearSection).join('');
for (const {id,items} of gearRequested) {
  const section = document.getElementById(id);
  const select = section.querySelector('select');
  const search = section.querySelector('input[type=search]');
  const available = id === 'bags' ? [...freeTourBags,...items] : items;
  const cards = [...section.querySelectorAll('.card')];
  const shop = section.querySelector('.freetour-bags');
  const status = section.querySelector('[role=status]');
  function filterGear() {
    let count = 0;
    const query = search?.value.trim().toLocaleLowerCase() || '';
    cards.forEach((card,index) => {
      const [brand,model,use] = available[index];
      card.hidden = (Boolean(select.value) && use !== select.value) ||
        !query.split(/\s+/).every(word => (brand+' '+model).toLocaleLowerCase().includes(word));
      if (!card.hidden) count++;
    });
    if (shop) shop.hidden = cards.slice(0,freeTourBags.length).every(card => card.hidden);
    status.textContent = 'Карточек в каталоге: '+count+' из '+available.length;
  }
  select.addEventListener('change',filterGear);
  search?.addEventListener('input',filterGear);
  filterGear();
}

gearRoot.addEventListener('error',event => {
  const image = event.target;
  if (!image.matches?.('.gear-photo img')) return;
  const figure = image.closest('figure');
  figure.classList.add('photo-unavailable');
  figure.textContent = 'Фото временно недоступно';
},true);
