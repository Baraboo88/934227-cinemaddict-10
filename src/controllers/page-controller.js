import ShowMoreButton from '../components/show-more-button';
import {render, remove} from '../utils/render';
import NoMovies from '../components/no-movies';
import TopRated from '../components/top-rated';
import MostCommented from '../components/most-commented';
import Films from '../components/films';
import Sort, {sortTypes} from '../components/sort';
import MovieController from './movie-controller';
import NavigationController from './navigation-controller';

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
  constructor(container, movies, stat) {
    this._container = container;
    this._showMoreButton = new ShowMoreButton();
    this._films = new Films();
    this._sort = new Sort();
    this._stat = stat;
    this._moviesControllers = [];
    this._moviesDataArray = null;
    this._navigation = null;
    this._movies = movies;
    this._showFilmsCount = 0;
    this._filmsListBlock = document.querySelector(`.films-list`);
    this._filmsContainer = document.querySelector(`.films-list__container`);
    this._onDataChange = (movieController, oldMovieData, newMovieData) => (evt) => {
      if (evt) {
        evt.preventDefault();
      }
      if (newMovieData === null) {
        const oldMovie = Object.assign({}, movieController.getMovieData());
        const oldMovieComment = [...oldMovie.comments];
        const index = oldMovieComment.findIndex((el) => el.id === (oldMovieData * 1));
        oldMovieComment.splice(index, 1);
        oldMovie.comments = oldMovieComment;
        this._movies.updateMovie(oldMovie.id, oldMovie);
        movieController.render(oldMovie);
      } else {
        this._movies.updateMovie(newMovieData.id, newMovieData);
        this._navigation.rerender();
        movieController.render(newMovieData);
      }

    };

    this._onViewChange = () => {
      this._moviesControllers.forEach((el) => {
        el.setDefaultView();
      });
    };
    this._onFilterChange = () => {
      this.renderFilms(this._movies.getMovies());
    };

    this._sortClickHandler = (sortType) => {
      let sortedFilms = [...this._movies.getMovies()];
      switch (sortType) {
        case sortTypes.DEFAULT:
          this.renderFilms(sortedFilms);
          break;
        case sortTypes.BY_DATE:
          this.renderFilms(sortedFilms.sort((a, b) => b.releaseDate - a.releaseDate));
          break;
        case sortTypes.BY_RATING:
          this.renderFilms(sortedFilms.sort((a, b) => b.filmMark - a.filmMark));
          break;
      }
    };

    this._showMoreButtonClickHandler = () => {
      let previousShowCount = this._showFilmsCount;
      this._showFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
      this._moviesControllers = this._moviesControllers.concat(
          renderMovies(
              this._filmsContainer,
              this._movies.getMovies().slice(previousShowCount, this._showFilmsCount),
              this._onDataChange,
              this._onViewChange
          )
      );
      if (this._showFilmsCount >= this._movies.getMovies()) {
        remove(this._showMoreButton);
      }
    };

    this._movies.setFilterClickHandler(this._onFilterChange);
  }

  render() {
    this._navigation = new NavigationController(this._container, this._movies, this, this._stat);
    this._showFilmsCount = NUMBER_OF_FILMS_ADD;

    this._navigation.render();
    render(this._container, this._sort.getElement());
    render(this._container, this._films.getElement());
    this._filmsListBlock = document.querySelector(`.films-list`);
    this._filmsContainer = document.querySelector(`.films-list__container`);
    this._sort.setFilterClickHandler(this._sortClickHandler);
    this.renderFilms(this._movies.getMoviesAll());
  }

  renderFilms(filmsToRender) {
    this._showFilmsCount = NUMBER_OF_FILMS_ADD;
    while (this._filmsContainer.firstChild) {
      this._filmsContainer.removeChild(this._filmsContainer.firstChild);
    }
    if (filmsToRender.length === 0) {
      while (this._filmsListBlock.querySelector(`.films-list__title`)) {
        this._filmsListBlock.removeChild(this._filmsListBlock.querySelector(`.films-list__title`));
      }
      render(this._filmsListBlock, new NoMovies().getElement());
    } else if (this._movies.getMovies().length > this._showFilmsCount) {
      render(this._filmsListBlock, this._showMoreButton.getElement());
      this._showMoreButton.setShowMoreButtonClickHandler(this._showMoreButtonClickHandler);
    }

    this._moviesControllers = this._moviesControllers.concat(
        renderMovies(
            this._filmsContainer,
            filmsToRender.slice(0, NUMBER_OF_FILMS_START),
            this._onDataChange,
            this._onViewChange
        )
    );
    const getTwoTopElOfArr = (arr, comparator) => arr.sort(comparator).slice(0, 2);
    const getTwoTopRates = (arr) => getTwoTopElOfArr(arr, (a, b) => b.filmMark - a.filmMark);
    const getTwoTopCommented = (arr) =>
      getTwoTopElOfArr(arr, (a, b) => b.comments.length - a.comments.length);
    const topRatedFilms = getTwoTopRates(filmsToRender);
    const topCommentedFilms = getTwoTopCommented(filmsToRender);
    while (document.querySelector(`.films-list--extra`)) {
      document.querySelector(`.films-list--extra`).parentElement.removeChild(document.querySelector(`.films-list--extra`));
    }
    if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
      render(this._films.getElement(), new TopRated().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topRatesBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(
          renderMovies(topRatesBlock, topRatedFilms, this._onDataChange, this._onViewChange)
      );
    }

    if (topCommentedFilms.length > 0 && topCommentedFilms[0].comments !== 0) {
      render(this._films.getElement(), new MostCommented().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topCommentedBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(
          renderMovies(topCommentedBlock, topCommentedFilms, this._onDataChange, this._onViewChange)
      );
    }
  }

  hide() {
    this._films.hide();
    this._sort.hide();
  }

  show() {
    this._films.show();
    this._sort.show();
  }

}
