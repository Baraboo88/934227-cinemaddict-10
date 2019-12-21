import {filterTypes} from '../utils/util';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = filterTypes.ALL;
    this._dataChangeHandler = null;
    this._changeFilterHandler = null;
  }

  setMovies(movies) {
    this._movies = movies;
  }
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._changeFilterHandler();
  }

  getMovies() {
    return this.getMovieByFilter();
  }

  getMoviesAll() {
    return this._movies;
  }

  getMovieByFilter() {
    switch (this._activeFilterType) {
      case filterTypes.FAVORITES:
        return this._movies.filter((el) => el.isFavorite);
      case filterTypes.HISTORY:
        return this._movies.filter((el) => el.isInHistory);
      case filterTypes.WHATCHLIST:
        return this._movies.filter((el) => el.isInWatchList);
      default:
        return this._movies;
    }
  }

  updateMovie(id, movie) {
    const tempArr = [...this._movies];
    const movieToChange = tempArr.find((el) => el.id === id);
    const index = tempArr.indexOf(movieToChange);
    tempArr[index] = movie;
    this._movies = tempArr;
    this._dataChangeHandler();
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandler = handler;
  }

  setFilterClickHandler(handler) {
    this._changeFilterHandler = handler;
  }
}
