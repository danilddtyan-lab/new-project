'use strict';

const workouts = [
  {
    id:'easy-35', title:'Лёгкая прокрутка', exportName:'Veloburo Easy Spin',
    description:'После перерыва или между нагрузочными днями. Держите усилие лёгким, чтобы спокойно разговаривать.',
    blocks:[['Разминка',8,45],['Ровная прокрутка',20,55],['Заминка',7,45]]
  },
  {
    id:'base-50', title:'База для байкпакинга', exportName:'Veloburo Endurance',
    description:'Ровная работа на выносливость. Дышите спокойно и держите удобный каденс без резких ускорений.',
    blocks:[['Разминка',10,50],['Ровная работа',35,65],['Заминка',5,45]]
  },
  {
    id:'tempo-55', title:'Темп для длинных подъёмов', exportName:'Veloburo Tempo Climbs',
    description:'Для тех, кто уже регулярно крутит станок. Три устойчивых усилия с лёгким восстановлением между ними.',
    blocks:[['Разминка',10,55],['Темп',10,83],['Восстановление',4,50],['Темп',10,83],['Восстановление',4,50],['Темп',10,83],['Заминка',7,45]]
  }
];

const trainingForm = document.getElementById('training-form');
const workoutSelect = document.getElementById('workout-select');
const ftp = document.getElementById('training-ftp');
const detail = document.getElementById('workout-detail');
const formatPower = new Intl.NumberFormat('ru',{maximumFractionDigits:0});

for (const workout of workouts) {
  const minutes = workout.blocks.reduce((total,[,duration]) => total+duration,0);
  workoutSelect.add(new Option(workout.title+' · '+minutes+' мин',workout.id));
}

function currentWorkout() {
  return workouts.find(workout => workout.id === workoutSelect.value) || workouts[0];
}

function renderWorkout() {
  const workout = currentWorkout();
  const watts = ftp.validity.valid && ftp.value !== '' ? ftp.valueAsNumber : null;
  const totalMinutes = workout.blocks.reduce((total,[,minutes]) => total+minutes,0);
  const chart = workout.blocks.map(([,minutes,percent]) =>
    `<span style="flex-grow:${minutes};height:${percent}%"></span>`).join('');
  const rows = workout.blocks.map(([label,minutes,percent]) =>
    `<tr><th scope="row">${label}</th><td>${minutes} мин</td><td>${percent}%</td>
      ${watts === null ? '' : `<td>${formatPower.format(watts*percent/100)} Вт</td>`}</tr>`).join('');
  detail.innerHTML = `<h3>${workout.title} · ${totalMinutes} мин</h3><p>${workout.description}</p>
    <div class="workout-profile" aria-hidden="true">${chart}</div>
    <table><thead><tr><th scope="col">Этап</th><th scope="col">Время</th><th scope="col">% FTP</th>
      ${watts === null ? '' : '<th scope="col">Вт</th>'}</tr></thead><tbody>${rows}</tbody></table>`;
}

trainingForm.addEventListener('submit',event => event.preventDefault());
trainingForm.addEventListener('input',renderWorkout);
workoutSelect.addEventListener('change',renderWorkout);
document.getElementById('download-zwo').addEventListener('click',() => {
  const workout = currentWorkout();
  const steps = workout.blocks.map(([,minutes,percent]) =>
    `    <SteadyState Duration="${minutes*60}" Power="${(percent/100).toFixed(2)}"/>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<workout_file>
  <author>Veloburo</author>
  <name>${workout.exportName}</name>
  <sportType>bike</sportType>
  <workout>
${steps}
  </workout>
</workout_file>
`;
  const href = URL.createObjectURL(new Blob([xml],{type:'application/xml'}));
  const link = document.createElement('a');
  link.href = href;
  link.download = 'veloburo-'+workout.id+'.zwo';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href),1000);
});

renderWorkout();
