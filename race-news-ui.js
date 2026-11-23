'use strict';

const raceNewsSections = {
  upcoming:document.getElementById('race-upcoming'),
  riders:document.getElementById('race-riders'),
  archive:document.getElementById('race-news')
};
const raceToday = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Bishkek',dateStyle:'short'}).format(new Date());
const raceOrder = (item,other) => {
  const future = item.category === 'upcoming' && item.date >= raceToday;
  const otherFuture = other.category === 'upcoming' && other.date >= raceToday;
  if (future !== otherFuture) return future ? -1 : 1;
  if (future) return item.date.localeCompare(other.date);
  return other.date.localeCompare(item.date);
};
for (const item of [...raceNews].sort(raceOrder)) {
  const category = item.category === 'upcoming' && item.date < raceToday ? 'archive' : item.category;
  const grid = raceNewsSections[category] || raceNewsSections.archive;
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
  grid.append(card);
}
if (!raceNewsSections.upcoming.children.length) {
  const message = document.createElement('p');
  const link = document.createElement('a');
  link.href = 'https://velosport.kg/calendar';
  link.textContent = 'Смотреть календарь Федерации велоспорта Кыргызстана';
  message.append(link);
  raceNewsSections.upcoming.append(message);
}
