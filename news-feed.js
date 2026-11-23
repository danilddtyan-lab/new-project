'use strict';

const formatter = new Intl.DateTimeFormat('ru',{dateStyle:'long',timeZone:'UTC'});
const carousel = document.getElementById('headline-news');
const archive = document.getElementById('news-list');
const newsStatus = document.getElementById('feed-status');

function sourceLink(item,label,newTab = false) {
  if (!item.url) return null;
  const link = document.createElement('a');
  link.href = item.url;
  link.textContent = label;
  if (newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label',label+' (откроется в новой вкладке)');
  }
  return link;
}

function createNewsCard(item,headline = false) {
  const card = document.createElement('article');
  card.className = headline ? 'headline-card' : 'card feed-card';
  if (!headline) card.id = item.id;
  const meta = document.createElement('p');
  meta.className = 'meta';
  const time = document.createElement('time');
  time.dateTime = item.date;
  time.textContent = formatter.format(new Date(item.date+'T00:00:00Z'));
  meta.append(time,' · '+item.category+' · '+item.region);
  const title = document.createElement(headline ? 'h3' : 'h2');
  title.textContent = item.title;
  const summary = document.createElement('p');
  summary.textContent = item.summary;
  if (!item.image) {
    const placeholder = document.createElement('div');
    placeholder.className = 'headline-placeholder';
    placeholder.setAttribute('aria-hidden','true');
    card.append(placeholder);
  } else if (item.image) {
    const image = document.createElement('img');
    image.className = 'headline-image';
    image.src = item.image;
    image.alt = '';
    card.append(image);
  }
  card.append(meta,title,summary);
  const link = sourceLink(item,headline ? 'Читать' : 'Источник',headline);
  if (link) {
    if (headline) link.className = 'solid';
    card.append(link);
  }
  return card;
}

function showArchive(items) {
  const form = document.getElementById('news-filters');
  const query = new URLSearchParams(location.search);
  for (const name of ['category','region']) {
    const field = form.elements[name];
    const value = query.get(name);
    if ([...field.options].some(option => option.value === value)) field.value = value;
  }
  function render() {
    const {category,region} = form.elements;
    const visible = items.filter(item =>
      (!category.value || category.value === item.category) &&
      (!region.value || region.value === item.region));
    archive.replaceChildren(...visible.map(item => createNewsCard(item)));
    newsStatus.textContent = visible.length ? 'Материалов: '+visible.length : 'По этим фильтрам новостей нет.';
  }
  form.addEventListener('change',render);
  form.addEventListener('submit',event => event.preventDefault());
  form.hidden = false;
  render();
  const hash = location.hash.slice(1);
  const id = hash === 'vlad-podofedov' ? 'srmr-2026-kyrgyz-pair-win' : hash;
  if (id) document.getElementById(id)?.scrollIntoView();
}

function showCarousel(items) {
  if (!items.length) {
    newsStatus.textContent = 'Новостей пока нет.';
    return;
  }
  const slide = document.getElementById('headline-slide');
  const controls = document.getElementById('headline-controls');
  const dots = document.getElementById('headline-dots');
  const pause = document.getElementById('headline-pause');
  let position = 0;
  let timer;
  let hovered = false;
  let focused = carousel.matches(':focus-within');
  let manuallyPaused = false;
  let touch;
  let swipedAt = -Infinity;

  function stop() {
    clearInterval(timer);
    timer = undefined;
  }
  function restart() {
    stop();
    if (items.length >= 2 && !hovered && !focused && !manuallyPaused && !document.hidden) {
      timer = setInterval(() => show(position+1),7_000);
    }
  }
  function show(index,announce = false) {
    position = (index+items.length)%items.length;
    slide.replaceChildren(createNewsCard(items[position],true));
    [...dots.children].forEach((button,i) => button.setAttribute('aria-current',String(i === position)));
    if (announce) {
      newsStatus.textContent = (position+1)+' из '+items.length+'. '+items[position].title;
      restart();
    }
  }

  if (items.length >= 2) {
    items.forEach((item,index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label','Новость '+(index+1)+' из '+items.length+': '+item.title);
      button.addEventListener('click',() => show(index,true));
      dots.append(button);
    });
    controls.hidden = false;
    for (const button of controls.querySelectorAll('[data-step]')) {
      button.addEventListener('click',() => show(position+Number(button.dataset.step),true));
    }
    pause.addEventListener('click',() => {
      manuallyPaused = !manuallyPaused;
      pause.setAttribute('aria-pressed',String(manuallyPaused));
      restart();
    });
    carousel.addEventListener('pointerenter',event => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        hovered = true;
        restart();
      }
    });
    carousel.addEventListener('pointerleave',() => {
      hovered = false;
      restart();
    });
    carousel.addEventListener('focusin',() => {
      focused = true;
      restart();
    });
    carousel.addEventListener('focusout',event => {
      focused = carousel.contains(event.relatedTarget);
      restart();
    });
    slide.addEventListener('pointerdown',event => {
      if (event.pointerType === 'touch' && event.isPrimary) {
        touch = {id:event.pointerId,x:event.clientX,y:event.clientY};
      }
    });
    slide.addEventListener('pointercancel',() => { touch = undefined; });
    slide.addEventListener('pointerup',event => {
      if (touch?.id !== event.pointerId) return;
      const x = event.clientX-touch.x;
      const y = event.clientY-touch.y;
      touch = undefined;
      if (Math.abs(x) >= 45 && Math.abs(x) > Math.abs(y)*1.4) {
        swipedAt = performance.now();
        show(position+(x < 0 ? 1 : -1),true);
      }
    });
    slide.addEventListener('click',event => {
      if (performance.now()-swipedAt < 400 && event.detail > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
    },true);
    document.addEventListener('visibilitychange',restart);
    window.addEventListener('pagehide',stop);
    window.addEventListener('pageshow',restart);
  }
  show(0);
  restart();
}

fetch('./data/news.json')
  .then(response => {
    if (!response.ok) throw new Error('News request failed: '+response.status);
    return response.json();
  })
  .then(items => {
    items.sort((a,b) => b.date.localeCompare(a.date));
    if (carousel) showCarousel(items);
    if (archive) showArchive(items);
  })
  .catch(() => {
    newsStatus.textContent = 'Не удалось загрузить новости. Обновите страницу.';
    newsStatus.classList.remove('feed-sr-only');
  });
