'use strict';

const raceNewsGrid = document.getElementById('race-news');
for (const item of [...raceNews].sort((a,b) => b.date.localeCompare(a.date))) {
  const card = document.createElement('article');
  card.className = 'card';
  const date = document.createElement('time');
  date.className = 'meta';
  date.dateTime = item.date;
  date.textContent = item.dateLabel;
  const title = document.createElement('h3');
  title.textContent = item.title;
  const summary = document.createElement('p');
  summary.textContent = item.summary;
  const source = document.createElement('a');
  source.href = item.source;
  source.textContent = item.sourceLabel;
  card.append(date,title,summary,source);
  raceNewsGrid.append(card);
}
