'use strict';

const legacySections = {
  selection:'selection.html', catalog:'catalog.html', dropbar:'catalog.html#dropbar',
  gallery:'gallery.html', marketplace:'marketplace.html', lev:'lev.html',
  bags:'bags.html', wheels:'wheels.html', tires:'tires.html', drivetrains:'drivetrains.html',
  guide:'catalog.html#guide'
};
if (document.body.dataset.page === 'home') {
  function redirectOldSection() {
    const section = location.hash.slice(1);
    if (Object.hasOwn(legacySections,section)) location.replace('./'+legacySections[section]);
  }
  window.addEventListener('hashchange',redirectOldSection);
  redirectOldSection();
}
