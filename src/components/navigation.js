import {capitalizeFirstLetter, createElement} from '../util';

const addNavigationBlock = (filters) => {
  const renderFilters = () => {
    return filters.map((el) => `<a href="#${el.title}" class="main-navigation__item">${capitalizeFirstLetter(el.title)}<span class="main-navigation__item-count">${el.count}</span></a>`).join(`\n`);
  };

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${renderFilters()}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};


export default class Navigation {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return addNavigationBlock(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
