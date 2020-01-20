import AbstractComponent from './abstract-component';

export const SortType = {
  DEFAULT: `default`,
  BY_DATE: `by-date`,
  BY_RATING: `by-rating`
};

const addSortBlock = () => {
  return `<ul class="sort">
    <li><a data-sort-type = ${SortType.DEFAULT} href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a data-sort-type = ${SortType.BY_DATE} href="#" class="sort__button">Sort by date</a></li>
    <li><a data-sort-type = ${SortType.BY_RATING} href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._sortType = SortType.DEFAULT;
    this._activeLink = this.getElement().querySelector(`.sort__button--active`);
  }
  getTemplate() {
    return addSortBlock();
  }

  setFilterClickHandler(handler) {
    const elementClickHandler = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._sortType === sortType) {
        return;
      }
      this._activeLink.classList.remove(`sort__button--active`);
      this._activeLink = evt.target;
      this._activeLink.classList.add(`sort__button--active`);
      this._sortType = sortType;

      handler(this._sortType);
    };
    this.getElement().addEventListener(`click`, elementClickHandler);
  }
}
