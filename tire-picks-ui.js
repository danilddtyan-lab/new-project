'use strict';

const tireGrid = document.getElementById('tire-picks');
for (const tire of tirePicks) {
  const card = document.createElement('article');
  card.className = 'card';
  const title = document.createElement('h3');
  title.textContent = tire.name;
  const size = document.createElement('p');
  size.className = 'meta';
  size.textContent = tire.size+' · '+tire.weight+' г · '+tire.casing;
  const description = document.createElement('p');
  description.textContent = tire.tread+' '+tire.use;
  const link = document.createElement('a');
  link.href = tire.source;
  link.textContent = 'Характеристики и фото протектора';
  card.append(title,size,description,link);
  if (tire.name === 'Maxxis Aspen') {
    const sketch = document.createElement('div');
    sketch.className = 'aspen-sketch';
    sketch.setAttribute('role','img');
    sketch.setAttribute('aria-label','Условная схема Aspen. Мелкие шашки по центру, крупные по краям.');
    card.insertBefore(sketch,description);
  }
  tireGrid.append(card);
}
