'use strict';

const boardRepo = 'danilddtyan-lab/new-project';
const boardPrefix = '[Барахолка] ';
const boardGrid = document.getElementById('board-grid');
const boardStatus = document.getElementById('board-status');
const boardFilter = document.getElementById('board-filter');
const boardRefresh = document.getElementById('board-refresh');
const boardDialog = document.getElementById('board-dialog');
let boardEntries = null;

function renderBoard() {
  if (!boardEntries) return;
  const filtered = boardEntries.filter(item => !boardFilter.value ||
    item.title.startsWith(boardPrefix+boardFilter.value+' · '));
  boardStatus.textContent = filtered.length ? '' : boardFilter.value ?
    'В этой категории пока нет объявлений.' : 'Пока нет открытых объявлений.';
  const cards = filtered.map(item => {
    const article = document.createElement('article');
    article.className = 'card';
    const heading = document.createElement('h3');
    heading.textContent = item.title.slice(boardPrefix.length);
    const link = document.createElement('a');
    link.href = 'https://github.com/'+boardRepo+'/issues/'+item.number;
    link.textContent = 'Открыть объявление и комментарии';
    article.append(heading,link);
    return article;
  });
  boardGrid.replaceChildren(...cards);
}

async function loadBoard() {
  boardRefresh.disabled = true;
  boardStatus.textContent = 'Загружаем объявления…';
  try {
    const response = await fetch('https://api.github.com/repos/'+boardRepo+'/issues?state=open&per_page=100', {
      headers:{Accept:'application/vnd.github+json'}
    });
    if (!response.ok) throw new Error('GitHub '+response.status);
    const issues = await response.json();
    boardEntries = issues.filter(item => Number.isSafeInteger(item.number) &&
      !item.pull_request && typeof item.title === 'string' &&
      /^(Продам|Куплю) · /.test(item.title.slice(boardPrefix.length)) && item.title.startsWith(boardPrefix));
    renderBoard();
  } catch {
    boardStatus.textContent = 'Лента временно недоступна. Откройте объявления на GitHub.';
  } finally {
    boardRefresh.disabled = false;
  }
}

boardFilter.addEventListener('change',renderBoard);
boardRefresh.addEventListener('click',loadBoard);
document.getElementById('board-open').addEventListener('click',() => boardDialog.showModal());
document.getElementById('board-form').addEventListener('submit',event => {
  event.preventDefault();
  const fields = event.currentTarget;
  for (const name of ['product','city','description']) {
    if (!fields.elements[name].value.trim()) {
      fields.elements[name].focus();
      return;
    }
  }
  const {kind,product,city,price,description} = Object.fromEntries(new FormData(fields));
  const draft = new URL('https://github.com/'+boardRepo+'/issues/new');
  draft.searchParams.set('title',boardPrefix+kind+' · '+product.trim()+' · '+city.trim());
  draft.searchParams.set('body','**Город:** '+city.trim()+'\n**Цена:** '+(price.trim() || 'по договорённости')+
    '\n\n'+description.trim()+'\n\n<!-- При необходимости прикрепите фото. Для связи используйте комментарии. -->');
  window.location.assign(draft.href);
});

const boardObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  boardObserver.disconnect();
  if (!boardRefresh.disabled && !boardEntries) loadBoard();
}, {rootMargin:'300px'});
boardObserver.observe(boardGrid.parentElement);
