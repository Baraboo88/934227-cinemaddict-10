import {capitalizeFirstLetter} from '../utils/util';
import AbstractComponent from "./abstract-component";

const addNavigationBlock = (filters, activeFilter) => {
  const renderFilters = () => {
    return filters.map((el) => `<a href="#${el.title}" class="main-navigation__item ${activeFilter === el.title ? `main-navigation__item--active` : ``}">${capitalizeFirstLetter(el.title)}<span class="main-navigation__item-count">${el.count}</span></a>`).join(`\n`);
  };

  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${activeFilter === `all` ? `main-navigation__item--active` : ``}">All movies</a>
    ${renderFilters()}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};


export default class Navigation extends AbstractComponent {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._acviteFilter = activeFilter;
  }

  getTemplate() {
    return addNavigationBlock(this._filters, this._acviteFilter);
  }

  setFiltersClickHandler(handler) {
    const filterClickHandler = (evt) => {
      evt.preventDefault();
      const activeFilter = this.getElement().querySelector(`.main-navigation__item--active`);
      activeFilter.classList.remove(`main-navigation__item--active`);
      const clickedFilter = evt.target;
      clickedFilter.classList.add(`main-navigation__item--active`);
      const hrefArr = evt.target.href.split(`/`);
      const filterName = hrefArr[hrefArr.length - 1].slice(1);
      handler(filterName);
    };

    this.getElement().addEventListener(`click`, filterClickHandler);

  }

}
