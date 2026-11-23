'use strict';

const galleryGrid = document.getElementById('gallery-posts');
const posts = galleryPosts.map(post => new Promise(resolve => {
  const image = new Image();
  image.alt = post.alt;
  image.decoding = 'async';
  image.addEventListener('error',() => resolve(null),{once:true});
  image.addEventListener('load',() => {
    const {naturalWidth:width,naturalHeight:height} = image;
    const ratio = width / height;
    if (Math.min(width,height) < 1080 || ratio < .67 || ratio > 1.8) {
      resolve(null);
      return;
    }
    image.width = width;
    image.height = height;
    const article = document.createElement('article');
    article.className = 'travel-card';
    const link = document.createElement('a');
    link.href = post.url;
    link.setAttribute('aria-label',post.title+' в Instagram');
    link.append(image);
    const copy = document.createElement('div');
    copy.className = 'rider-caption';
    const time = document.createElement('time');
    time.dateTime = post.date;
    time.className = 'meta';
    time.textContent = new Intl.DateTimeFormat('ru',{dateStyle:'long',timeZone:'UTC'}).format(new Date(post.date));
    const title = document.createElement('h3');
    title.textContent = post.title;
    const original = document.createElement('a');
    original.href = post.url;
    original.textContent = 'Публикация @'+post.author;
    copy.append(time,title,original);
    article.append(link,copy);
    resolve(article);
  },{once:true});
  image.src = post.image;
}));
Promise.all(posts).then(cards => {
  const visible = cards.filter(Boolean);
  if (!visible.length) return;
  galleryGrid.append(...visible);
  galleryGrid.closest('section').hidden = false;
});
