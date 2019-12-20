import {filterTypes} from '../utils/util';
import Navigation from '../components/navigation';
import {replace, render} from '../utils/render';
import {generateFilters} from '../mock/filters';

export default class NavigationController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._filter = null;
    this._activeFilterType = filterTypes.ALL;
    this._navigation = null;
    this._onDataChange = () => {
      this.rerender();
    };
    this._onFilterChange = (filterType) => {
      this._model.setFilter(filterType);
    };
    this._model.setDataChangeHandler(this._onDataChange);
  }
  render() {
    this._navigation = new Navigation(generateFilters(this._model.getMoviesAll()));
    this._navigation.setFiltersClickHandler(this._onFilterChange);
    render(this._container, this._navigation.getElement());
  }

  rerender() {
    const newNavComp = new Navigation(generateFilters(this._model.getMoviesAll()));
    replace(newNavComp.getElement(), this._navigation.getElement());
    this._navigation = newNavComp;
    this._navigation.setFiltersClickHandler(this._onFilterChange);
  }
}
