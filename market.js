'use strict';

const pinduoduoQueries = {
  SPCycle: 'SPCycle 碳纤维 自行车 车架',
  Tideace: 'Tideace 碳纤维 自行车 车架',
  Twitter: 'TWITTER 自行车 车架',
  LightCarbon: 'LightCarbon 碳纤维 自行车 车架',
  ICAN: 'ICAN 碳纤维 自行车 车架',
  Carbonda: 'Carbonda 碳纤维 自行车 车架',
  Winspace: 'WINSPACE 碳纤维 自行车 车架',
  YOELEO: 'YOELEO 碳纤维 自行车 车架',
  Seaboard: 'Seaboard 自行车 车架',
  'TanTan Seraph': 'TanTan SERAPH 碳纤维 自行车 车架',
  VeloBuild: 'VeloBuild 碳纤维 自行车 车架'
};
const pinduoduoProductQueries = {
  'Rhinowalk/Plateau X 1,7 л': 'Rhinowalk 犀牛走 Plateau BGY0071 1.7L 自行车 三角包',
  'Rhinowalk/Wilderness 14 л': 'Rhinowalk 犀牛走 Wilderness 14L 自行车 尾包'
};

function renderMarketLink(id) {
  const [brand, model] = id.split('/');
  const brandQuery = Object.hasOwn(pinduoduoQueries,brand) && pinduoduoQueries[brand];
  const query = pinduoduoProductQueries[id] || (brandQuery ? brandQuery+' '+model : '');
  if (!query) return '';
  const url = new URL('https://mobile.yangkeduo.com/search_result.html');
  url.searchParams.set('search_key', query);
  return `<a class="market-link" href="${url.href}" target="_blank" rel="noopener noreferrer">Найти на Pinduoduo</a>`;
}
