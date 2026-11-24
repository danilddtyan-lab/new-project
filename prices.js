'use strict';

const priceRates = {
  date: '24.11.2026',
  source: 'https://www.nbkr.kg/getservice.jsp?lang=RUS&sname=CurVal',
  KGS: 1, USD: 87.45, RUB: 1.0678
};
const priceNumbers = new Intl.NumberFormat('ru',{maximumFractionDigits:0});

function dualPrice(values,currency) {
  const inSom = values.map(value => value*priceRates[currency]);
  const range = (numbers,round) => numbers.map(value => priceNumbers.format(Math.round(value/round)*round)).join('–');
  return range(inSom,values.length > 1 ? 100 : 1)+' сом · '+range(inSom.map(value => value/priceRates.USD),1)+' USD';
}

function archivePrice(value) {
  const match = /^([\d\s]+(?:,\d+)?)\s+(RUB|USD|KGS)$/.exec(value);
  return match ? dualPrice([Number(match[1].replace(/\s/g,'').replace(',','.'))],match[2]) : value;
}
