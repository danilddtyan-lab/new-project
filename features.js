'use strict';

const dropbarPicks = [
  {
    id:'Salsa/Fargo', use:'Дальний автономный маршрут',
    note:'Стальная туристическая платформа с карбоновой вилкой и креплениями для груза. Хорошая отправная точка для многодневных маршрутов по грунту.',
    spec:'https://www.salsacycles.com/products/2026-fargo-steel-frameset',
    image:'https://www.salsacycles.com/cdn/shop/files/salsa-fargo-frame-2026-FM2804.png?v=1772576939&width=720',
    credit:'Salsa Cycles'
  },
  {
    id:'Surly/Grappler', use:'Каменистые тропы',
    note:'Стальная рама с геометрией под руль-баран и проводкой для дроппера. Вариант для маршрутов, где много троп и мало асфальта.',
    spec:'https://surlybikes.com/collections/grappler',
    image:'https://outflow.life/cdn/shop/files/surly-grappler-frameset-blue-FM2696-1200x800.jpg?v=1712784736&width=720',
    credit:'Outflow'
  },
  {
    id:'Tumbleweed/Stargazer', use:'Горный байкпакинг',
    note:'Стальной фреймсет с креплениями на вилке и платформой под трансмиссию 1×. Подойдёт для путешествий по горным дорогам и тропам.',
    spec:'https://tumbleweed.cc/products/stargazer',
    image:'https://tumbleweed.cc/cdn/shop/files/10_TumbleweedBikes-VKS-Product-ISO-Frame-Stargazer-Grey-350-June17-2021_WHITE.jpg?v=1769367487&width=720',
    credit:'Tumbleweed'
  },
  {
    id:'Salsa/Cutthroat', use:'Быстрые многодневки',
    note:'Карбоновая платформа для длинных маршрутов по грунту. Вариант, если важны темп и место для багажа внутри треугольника рамы.',
    spec:'https://www.salsacycles.com/collections/cutthroat',
    image:'https://www.salsacycles.com/cdn/shop/files/salsa-cutthroat-2026-frameset-FM6932.png?v=1771516014&width=720',
    credit:'Salsa Cycles'
  },
  {
    id:'Kona/Sutra LTD', use:'От асфальта до лесных дорог',
    note:'Стальная платформа для путешествий с увеличенным клиренсом. Подойдёт для маршрутов, где асфальт чередуется с разбитыми дорогами.',
    spec:'https://konaworld.com/products/sutra-ltd-frame',
    image:'https://konaworld.com/cdn/shop/files/my23_sutra_ltd_frame.jpg?v=1733100217&width=720',
    credit:'Kona'
  },
  {
    id:'Curve/GMX+', use:'Экспедиции на широких покрышках',
    note:'Титановый фреймсет для автономных поездок по грубым маршрутам. Точные размеры покрышек и осей сверяйте для выбранного поколения.',
    spec:'https://www.curvecycling.com/products/gmx-v2-titanium-frameset',
    image:'https://omafiets.com.au/cdn/shop/files/mg-6251-6cfde375-07af-48a0-bf83-1571d33b93cc.jpg?v=1746563958&width=720',
    credit:'Omafiets'
  }
];
const framePhotos = new Map([...dropbarPicks, {
  id:'Tideace/FM-GV201', image:'https://tideacebike.com/cdn/shop/files/T1000-carbon-gravel-frames.png?v=1723449554&width=720', credit:'Tideace'
}, {
  id:'SPCycle/G068', image:'https://usaimages.oss-us-west-1.aliyuncs.com/6230/product/20240702/Spcycle_G068_T1000_Carbon_Gravel_Bike_Frame_Semi_Internal_Cable_UDH_Hanger_Disc_Brake_Aero_Carbon_Gravel_Bicycle_Frameset_1719885879405_2.jpg_w2048.jpg', credit:'SPCycle'
}, {
  id:'SHULZ/The Lightning', image:'https://shulzbikes.com/cdn/shop/files/bigproduct_209-1897-nevskiyvechernevaevenings-framesetthelightningframenevaeveningpt5255.webp?v=1770805403&width=720', credit:'SHULZ'
}].map(item => [item.id,item]));

function renderFramePhoto(id) {
  const photo = framePhotos.get(id);
  if (!photo) return '';
  return `<figure class="frame-photo"><img src="${photo.image}" alt="Фреймсет ${id.replace('/',' ')}" loading="lazy" decoding="async" width="720" height="480" referrerpolicy="no-referrer"><figcaption>Фото: ${photo.credit}</figcaption></figure>`;
}

document.addEventListener('error', event => {
  if (!event.target.matches?.('.frame-photo img')) return;
  const figure = event.target.closest('figure');
  figure.textContent = 'Фото временно недоступно';
  figure.classList.add('photo-unavailable');
}, true);

document.getElementById('dropbar-grid').innerHTML = dropbarPicks.map(({id,use,note,spec}) =>
  `<article class="card">
    ${renderFramePhoto(id)}
    <p class="meta">${use}</p><h3>${id.replace('/',' ')}</h3><p>${note}</p>
    <a href="${spec}">Характеристики</a>
  </article>`).join('');

const newspaper = document.getElementById('news-dialog');
document.getElementById('open-news').addEventListener('click', () => newspaper.showModal());
newspaper.addEventListener('click', event => {
  if (event.target.closest('a[href^="#"]')) newspaper.close();
});
