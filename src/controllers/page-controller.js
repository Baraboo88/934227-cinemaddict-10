import ShowMoreButton from "../components/show-more-button";
import {render, remove, replace} from "../utils/render";
import {generateFilters} from "../mock/filters";
import NoMovies from "../components/no-movies";
import TopRated from "../components/top-rated";
import MostCommented from "../components/most-commented";
import Films from "../components/films";
import Sort, {sortTypes} from "../components/sort";
import MovieController from "./movie-controller";
import Navigation from './../components/navigation';


const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;

const renderMovies = (container, movies, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreButton = new ShowMoreButton();
    this._films = new Films();
    this._sort = new Sort();
    this._moviesControllers = [];
    this._moviesDataArray = null;
    this._navigation = null;
    this._onDataChange = (movieController, oldMovieData, newMovieData) => (evt) =>{
      if (evt) {
        evt.preventDefault();
      }
      const oldMovieIndex = this._moviesDataArray.findIndex((el) => el === oldMovieData);
      this._moviesDataArray[oldMovieIndex] = newMovieData;
      const newNavigation = new Navigation(generateFilters(this._moviesDataArray));
      replace(newNavigation.getElement(), this._navigation.getElement());
      this._navigation = newNavigation;
      movieController.render(newMovieData);
    };
    this._onViewChange = () => {
      this._moviesControllers.forEach((el) => {
        el.setDefaultView();
      });
    };
  }

  render(filmsData) {
    this._moviesDataArray = filmsData;
    this._navigation = new Navigation(generateFilters(this._moviesDataArray));
    let showFilmsCount = NUMBER_OF_FILMS_ADD;
    const getTwoTopElOfArr = (arr, comparator) => arr.sort(comparator).slice(0, 2);
    const getTwoTopRates = (arr) => getTwoTopElOfArr(arr, (a, b) => b.filmMark - a.filmMark);
    const getTwoTopCommented = (arr) =>
      getTwoTopElOfArr(arr, (a, b) => b.comments.length - a.comments.length);

    const showMoreButtonClickHandler = () => {
      let previousShowCount = showFilmsCount;
      showFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
      this._moviesControllers = this._moviesControllers.concat(renderMovies(filmsContainer, filmsData.slice(previousShowCount, showFilmsCount), this._onDataChange, this._onViewChange));
      if (showFilmsCount >= filmsData.length) {
        remove(this._showMoreButton);
      }
    };
    render(this._container, this._navigation.getElement());
    render(this._container, this._sort.getElement());
    render(this._container, this._films.getElement());
    const filmsListBlock = document.querySelector(`.films-list`);
    const filmsContainer = document.querySelector(`.films-list__container`);
    const renderFilms = (filmsToRender) => {
      showFilmsCount = NUMBER_OF_FILMS_ADD;
      while (filmsContainer.firstChild) {
        filmsContainer.removeChild(filmsContainer.firstChild);
      }
      if (filmsToRender.length === 0) {
        render(filmsListBlock, new NoMovies().getElement());
      } else if (filmsData.length > showFilmsCount) {
        render(filmsListBlock, this._showMoreButton.getElement());
        this._showMoreButton.setShowMoreButtonClickHandler(showMoreButtonClickHandler);
      }

      this._moviesControllers = this._moviesControllers.concat(renderMovies(filmsContainer, filmsToRender.slice(0, NUMBER_OF_FILMS_START), this._onDataChange, this._onViewChange));
    };

    const sortClickHandler = (sortType) => {
      let sortedFilms = [...filmsData];
      switch (sortType) {
        case sortTypes.DEFAULT:
          renderFilms(filmsData);
          break;
        case sortTypes.BY_DATE:
          renderFilms(sortedFilms.sort((a, b) => b.releaseDate - a.releaseDate));
          break;
        case sortTypes.BY_RATING:
          renderFilms(sortedFilms.sort((a, b) => b.filmMark - a.filmMark));
          break;
      }
    };

    this._sort.setFilterClickHandler(sortClickHandler);

    renderFilms(filmsData);

    const topRatedFilms = getTwoTopRates(filmsData);
    const topCommentedFilms = getTwoTopCommented(filmsData);

    if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
      render(this._films.getElement(), new TopRated().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topRatesBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(renderMovies(topRatesBlock, topRatedFilms, this._onDataChange, this._onViewChange));
    }

    if (topCommentedFilms.length > 0 && topCommentedFilms[0].comments !== 0) {
      render(this._films.getElement(), new MostCommented().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topCommentedBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(renderMovies(topCommentedBlock, topCommentedFilms, this._onDataChange, this._onViewChange));
    }
  }
}
