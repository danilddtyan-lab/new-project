'use strict';

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

const customWorkout = document.getElementById('personal-workout');
const customResult = document.getElementById('personal-workout-result');
customWorkout.addEventListener('submit',event => {
  event.preventDefault();
  const {level,goal,minutes,equipment} = Object.fromEntries(new FormData(customWorkout));
  const duration = Number(minutes);
  const actualGoal = goal === 'tempo' && (level === 'beginner' || duration < 35) ? 'endurance' : goal;
  const plan = workouts.find(workout => workout.id === workoutGoals[actualGoal]);
  const total = plan.blocks.reduce((sum,[,time]) => sum + time,0);
  const adjustment = actualGoal !== goal ? 'Начните с работы на выносливость. ' : '';
  if (equipment === 'outdoors') {
    const warmup = Math.floor(duration * .2);
    const cooldown = Math.floor(duration * .15);
    const main = duration - warmup - cooldown;
    const effort = actualGoal === 'tempo'
      ? ' Сделайте два отрезка по '+Math.floor(main / 3)+' мин с лёгкой ездой между ними и до заминки.'
      : '';
    customResult.textContent = adjustment+plan.title+' · '+duration+' мин. '+warmup+' мин разминки, '+main+' мин основной работы, '+cooldown+' мин заминки. '+outdoorEffort[actualGoal]+effort;
    return;
  }
  const previous = workouts.findIndex(workout => workout.id === 'personal');
  if (previous !== -1) {
    workouts.splice(previous,1);
    workoutSelect.querySelector('option[value="personal"]').remove();
  }
  let elapsed = 0;
  let allocated = 0;
  const blocks = plan.blocks.map(([label,time,power]) => {
    elapsed += time;
    const next = Math.round(elapsed * duration / total);
    const length = next - allocated;
    allocated = next;
    return [label,length,power];
  }).filter(([,length]) => length > 0);
  workouts.push({...plan,id:'personal',blocks});
  workoutSelect.add(new Option(plan.title+' · '+duration+' мин (подбор)','personal'));
  workoutSelect.value = 'personal';
  renderWorkout();
  customResult.textContent = adjustment+plan.title+' · '+duration+' мин. План и файл Zwift доступны ниже.';
});

if (trainingCommunities.length) {
  const community = document.getElementById('training-community');
  const links = document.getElementById('training-community-links');
  for (const group of trainingCommunities) {
    const card = document.createElement('article');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = group.name;
    const description = document.createElement('p');
    description.textContent = group.description;
    const link = document.createElement('a');
    link.className = 'outline';
    link.href = group.url;
    link.textContent = 'Вступить';
    link.setAttribute('aria-label','Вступить в '+group.name+' в Telegram');
    card.append(title,description,link);
    links.append(card);
  }
  community.hidden = false;
}
