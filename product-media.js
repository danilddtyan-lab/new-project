'use strict';

const productMedia = fetch('./data/product-media.json',{cache:'no-cache'})
  .then(response => response.ok ? response.json() : {})
  .catch(() => ({}));

function photoPlaceholder(id,category,label) {
  const figure = document.createElement('figure');
  figure.className = 'product-photo photo-unavailable';
  figure.dataset.photo = id;
  figure.dataset.illustration = {
    'Рамы':'frame', 'Сумки':'bag', 'Покрышки':'tire',
    'Колёса':'wheel', 'Трансмиссии':'drivetrain',
    'Подбор':'bike', 'Тренировки':'training', 'Маршруты':'route'
  }[category] || 'bike';
  const caption = document.createElement('figcaption');
  caption.textContent = label ? 'Схема · '+label : 'Схема · '+category;
  figure.append(caption);
  return figure;
}

productMedia.then(records => {
  function loadFigure(figure) {
    if (figure.dataset.photoReady) return;
    figure.dataset.photoReady = 'true';
    const photos = (records[figure.dataset.photo] || []).filter(photo =>
      photo.verified && photo.license && /^\.\/data\/images\/[\w/.–-]+\.(webp|jpe?g)$/i.test(photo.image_url || ''));
    if (!photos.length) return;
    const fallback = figure.firstElementChild;
    const image = new Image();
    image.loading = 'eager';
    image.decoding = 'async';
    const caption = document.createElement('figcaption');
    const controls = document.createElement('div');
    controls.className = 'product-photo-controls';
    let current = 0;
    let touchX;

    function show(index) {
      current = (index + photos.length) % photos.length;
      const photo = photos[current];
      caption.replaceChildren('Фото: ');
      for (const [name,url,prefix] of [[photo.source,photo.source_url,''],[photo.license,photo.license_url,' · ']]) {
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.textContent = name;
          caption.append(prefix,link);
        } else if (!prefix) caption.append(name);
      }
      if (photo.credit_note) caption.append(' · ',photo.credit_note);
      const subject = photo.alt || fallback.textContent.replace(/^Схема · /,'');
      const site = photo.source_url ? new URL(photo.source_url,document.baseURI).hostname : '';
      const photoSource = [photo.source,site].filter(Boolean).join(', ');
      image.alt = photoSource ? subject+' — источник: '+photoSource : subject;
      image.src = photo.image_url;
      for (const dot of controls.querySelectorAll('[data-photo-index]')) {
        dot.setAttribute('aria-current',String(Number(dot.dataset.photoIndex) === current));
      }
    }
    if (photos.length > 1) {
      function button(label,text,action) {
        const control = document.createElement('button');
        control.type = 'button';
        control.className = 'outline';
        control.setAttribute('aria-label',label);
        control.textContent = text;
        control.addEventListener('click',action);
        controls.append(control);
        return control;
      }
      button('Предыдущее фото','←',() => show(current-1));
      for (let index=0; index<photos.length; index++) {
        button('Фото '+(index+1),'•',() => show(index)).dataset.photoIndex = index;
      }
      button('Следующее фото','→',() => show(current+1));
      image.addEventListener('pointerdown',event => {
        if (event.pointerType === 'touch') touchX = event.clientX;
      });
      image.addEventListener('pointercancel',() => { touchX = undefined; });
      image.addEventListener('pointerup',event => {
        if (touchX !== undefined && Math.abs(event.clientX-touchX) > 45) show(current+(event.clientX < touchX ? 1 : -1));
        touchX = undefined;
      });
    }
    image.addEventListener('load',() => {
      const valid = Math.min(image.naturalWidth,image.naturalHeight) >= 1080;
      figure.classList.toggle('photo-unavailable',!valid);
      figure.replaceChildren(...(valid ? [image,caption] : [fallback]),controls);
    });
    image.addEventListener('error',() => {
      figure.classList.add('photo-unavailable');
      figure.replaceChildren(fallback,controls);
    });
    show(0);
  }
  for (const figure of document.querySelectorAll('[data-photo]')) loadFigure(figure);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches('[data-photo]')) loadFigure(node);
        for (const figure of node.querySelectorAll('[data-photo]')) loadFigure(figure);
      }
    }
  }).observe(document.body,{subtree:true,childList:true});
});
