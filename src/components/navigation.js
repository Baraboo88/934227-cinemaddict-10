import {capitalizeFirstLetter} from '../utils/util';
import AbstractComponent from "./abstract-component";

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


export default class Navigation extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return addNavigationBlock(this._filters);
  }
}
