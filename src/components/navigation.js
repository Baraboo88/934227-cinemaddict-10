import {capitalizeFirstLetter} from '../util';

export const addNavigationBlock = (filters) => {
  const renderFilters = () => {
    return filters.map((el) => `<a href="#${el.title}" class="main-navigation__item">${capitalizeFirstLetter(el.title)}<span class="main-navigation__item-count">${el.count}</span></a>`).join(`\n`);
  };

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${renderFilters()}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};
