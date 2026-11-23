'use strict';

function createGalleryCard(post) {
  return new Promise(resolve => {
    const image = new Image();
    image.alt = post.alt;
    image.decoding = 'async';
    let fallback = post.original;
    function retryOrSkip() {
      if (fallback) {
        image.src = fallback;
        fallback = null;
      } else {
        resolve(null);
      }
    }
    image.addEventListener('error',retryOrSkip);
    image.addEventListener('load',() => {
      const {naturalWidth:width,naturalHeight:height} = image;
      const ratio = width / height;
      if (Math.min(width,height) < 1080 || ratio < .67 || ratio > 1.8) {
        retryOrSkip();
        return;
      }
      image.width = width;
      image.height = height;
      const article = document.createElement('article');
      article.className = 'travel-card';
      const link = document.createElement('a');
      link.href = post.url;
      link.setAttribute('aria-label',post.title+' · исходный снимок');
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
      original.textContent = post.license ? post.author+' · оригинал' : 'Публикация @'+post.author;
      copy.append(time,title,original);
      if (post.license) {
        const credit = document.createElement('p');
        const license = document.createElement('a');
        license.href = post.licenseUrl;
        license.textContent = post.license;
        credit.append(license,' · кадрирование в сетке');
        copy.append(credit);
      }
      article.append(link,copy);
      resolve(article);
    });
    image.src = post.image;
  });
}

for (const [id,posts] of [['gallery-posts',galleryPosts],['route-photos',routePhotos]]) {
  const grid = document.getElementById(id);
  Promise.all(posts.map(createGalleryCard)).then(cards => {
    const visible = cards.filter(Boolean);
    if (!visible.length) return;
    grid.append(...visible);
    grid.closest('section').hidden = false;
  });
}
