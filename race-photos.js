'use strict';

const racePhotos = document.querySelector('.race-photos');
const raceSlides = [...racePhotos.querySelectorAll('.race-photo')];
const raceControls = racePhotos.querySelector('.race-photo-controls');
const raceCount = racePhotos.querySelector('.race-photo-count');
let racePhotoIndex = 0;

function moveRacePhoto(step) {
  raceSlides[racePhotoIndex].hidden = true;
  racePhotoIndex = (racePhotoIndex + step + raceSlides.length) % raceSlides.length;
  const slide = raceSlides[racePhotoIndex];
  const photo = slide.querySelector('img');
  if (!photo.hasAttribute('src')) photo.src = photo.dataset.src;
  slide.hidden = false;
  raceCount.textContent = `${racePhotoIndex + 1} из ${raceSlides.length}`;
}

for (const button of raceControls.querySelectorAll('button')) {
  button.addEventListener('click', () => moveRacePhoto(Number(button.dataset.step)));
}
racePhotos.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveRacePhoto(event.key === 'ArrowLeft' ? -1 : 1);
});
raceControls.hidden = false;
