import Navigation from '../components/navigation';
import {replace, render} from '../utils/render';
import {generateFilters} from '../utils/filters';
import {filterTypes} from '../utils/util';

export default class NavigationController {
  constructor(container, model, pageController, stat) {
    this._container = container;
    this._model = model;
    this._navigation = null;
    this._activeFilter = filterTypes.ALL;
    this._onDataChange = () => {
      this.rerender();
    };
    this._onFilterChange = (filterType) => {
      if (filterType === `stats`) {
        pageController.hide();
        stat.show();
        stat.renderChart();
        this._activeFilter = filterType;
      } else if (this._activeFilter === `stats`) {
        stat.hide();
        pageController.show();
        this._activeFilter = filterType;
        this._model.setFilter(filterType);
      } else {
        this._activeFilter = filterType;
        this._model.setFilter(filterType);
      }
    };
    this._model.setDataChangeHandler(this._onDataChange);
  }
  render() {
    this._navigation = new Navigation(generateFilters(this._model.getMoviesAll()), this._activeFilter);
    this._navigation.setFiltersClickHandler(this._onFilterChange);
    render(this._container, this._navigation.getElement());
  }

  rerender() {
    const newNavComp = new Navigation(generateFilters(this._model.getMoviesAll()), this._activeFilter);
    replace(newNavComp.getElement(), this._navigation.getElement());
    this._navigation = newNavComp;
    this._navigation.setFiltersClickHandler(this._onFilterChange);
  }
}
