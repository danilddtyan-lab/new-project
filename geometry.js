'use strict';

const geometryForm = document.getElementById('geometry-form');
const geometryResult = document.getElementById('geometry-result');
const formatMm = new Intl.NumberFormat('ru',{maximumFractionDigits:1,signDisplay:'exceptZero'});

geometryForm.addEventListener('submit',event => {
  event.preventDefault();
  const values = new FormData(geometryForm);
  const reach = Number(values.get('candidateReach'))-Number(values.get('referenceReach'));
  const stack = Number(values.get('candidateStack'))-Number(values.get('referenceStack'));
  geometryResult.textContent = 'Новая рама относительно удобного велосипеда. Reach: '+
    formatMm.format(reach)+' мм. Stack: '+formatMm.format(stack)+' мм.';
  geometryResult.hidden = false;
});
geometryForm.addEventListener('input',() => { geometryResult.hidden = true; });
