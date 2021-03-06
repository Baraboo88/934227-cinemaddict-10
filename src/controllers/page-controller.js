import ShowMoreButton from '../components/show-more-button';
import {render, remove} from '../utils/render';
import NoMovies from '../components/no-movies';
import TopRated from '../components/top-rated';
import MostCommented from '../components/most-commented';
import Films from '../components/films';
import Sort, {SortType} from '../components/sort';
import MovieController from './movie-controller';
import NavigationController from './navigation-controller';
import Movie from "../models/movie";
import Comment from "../models/comment";

const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;

const renderMovies = (container, movies, onDataChange, onViewChange, api) => {
  return movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange, onViewChange, api);
    movieController.render(movie);
    return movieController;
  });
};

export default class PageController {
  constructor(container, movies, stat, api) {
    this._api = api;
    this._container = container;
    this._showMoreButton = new ShowMoreButton();
    this._films = new Films();
    this._sort = new Sort();
    this._stat = stat;
    this._moviesControllers = [];
    this._filmsToRender = [];
    this._navigation = null;
    this._mostCommented = null;
    this._sortedType = SortType.DEFAULT;
    this._movies = movies;
    this._showFilmsCount = NUMBER_OF_FILMS_START;
    this._filmsListBlock = document.querySelector(`.films-list`);
    this._filmsContainer = document.querySelector(`.films-list__container`);
    this._onDataChange = (movieController, oldMovieData, newMovieData, filmDetail = null) => {
      if (newMovieData === null) {
        this._deleteComment(movieController, oldMovieData, newMovieData, filmDetail);
      } else if (filmDetail !== null) {
        this._createComment(movieController, oldMovieData, newMovieData, filmDetail);
      } else {
        this._updateMovie(movieController, oldMovieData, newMovieData);
      }

    };
    this._onViewChange = () => {
      this._moviesControllers.forEach((el) => {
        el.setDefaultView();
      });
    };
    this._onFilterChange = () => {
      this._sortMovies(this._sortedType);
    };

    this._sortClickHandler = (sortType) => {
      this._sortedType = sortType;
      this._sortMovies(sortType);
    };

    this._sortMovies = (sortType) => {
      let sortedFilms = [...this._movies.getMovies()];
      switch (sortType) {
        case SortType.DEFAULT:
          this.renderFilms(sortedFilms);
          break;
        case SortType.BY_DATE:
          this.renderFilms(sortedFilms.sort((a, b) => b.releaseDate - a.releaseDate));
          break;
        case SortType.BY_RATING:
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
              this._filmsToRender.slice(previousShowCount, this._showFilmsCount),
              this._onDataChange,
              this._onViewChange,
              this._api
          )
      );
      if (this._showFilmsCount >= this._movies.getMovies().length) {
        remove(this._showMoreButton);
      }
    };

    this._movies.setFilterClickHandler(this._onFilterChange);
  }

  _deleteComment(movieController, oldMovieData, newMovieData, filmDetail) {
    this._api.deleteComment(oldMovieData)
      .then(() => {
        const oldMovie = Movie.clone(movieController.getMovieData());
        const oldMovieComments = [...filmDetail._comments];
        const filteredComments = oldMovieComments.filter((el) => el.id * 1 !== oldMovieData * 1);
        oldMovie.comments = filteredComments.map((el) => el.id);
        this._movies.updateMovie(oldMovie.id, oldMovie);
        this._moviesControllers.forEach((newMovieController) => {
          if (newMovieController.getMovieData().id === movieController.getMovieData().id) {
            newMovieController.render(oldMovie);
          }
        });
        filmDetail._comments = filteredComments;
        filmDetail.rerender();
        this.renderTopCommented();
      })
      .catch(() => {
        if (movieController._isDeleteChanging) {
          movieController._newFilmDetail._comments.forEach((comment) => {
            comment.isDeleting = false;
          });
          movieController._isDeleteChanging = false;
          movieController._newFilmDetail.rerender();
        }
      });
  }

  _createComment(movieController, oldMovieData, newMovieData, filmDetail) {
    this._api.createComment(oldMovieData.id, newMovieData).then((response) => {
      const newMovie = Movie.parseMovie(response.movie);
      const newComments = Comment.parseComments(response.comments);
      const isSuccess = this._movies.updateMovie(oldMovieData.id, newMovie);
      if (isSuccess) {
        filmDetail._comments = newComments;
        filmDetail.setSending({flag: false, value: null});
        this._moviesControllers.forEach((newMovieController) => {
          if (newMovieController.getMovieData().id === movieController.getMovieData().id) {
            newMovieController.render(newMovie);
          }
        });
        this.renderTopCommented();
      }
    })
      .catch(() => {
        filmDetail.shakeComment();
      });
  }

  _updateMovie(movieController, oldMovieData, newMovieData) {
    this._api.updateMovie(oldMovieData.id, newMovieData)
      .then((updatedMovie) => {
        const isSuccess = this._movies.updateMovie(oldMovieData.id, updatedMovie);
        if (movieController._isRatingChanging) {
          movieController._isRatingChanging = false;
          movieController._newFilmDetail._personalRating = updatedMovie.personalRating;
          movieController._newFilmDetail.rerender();
        } else if (movieController._isFavoriteChanging) {
          movieController._isFavoriteChanging = false;
          movieController._newFilmDetail._isFavorite = updatedMovie.isFavorite;
          movieController._newFilmDetail.rerender();
        } else if (movieController._isAddToWatchListChanging) {
          movieController._isAddToWatchListChanging = false;
          movieController._newFilmDetail._isInWatchList = updatedMovie.isInWatchList;
          movieController._newFilmDetail.rerender();
        } else if (movieController._isInHistory) {
          movieController._isInHistory = false;
          movieController._newFilmDetail._isInHistory = updatedMovie.isInHistory;
          movieController._newFilmDetail.rerender();
        }
        if (isSuccess) {
          this._navigation.rerender();
          this._moviesControllers.forEach((newMovieController) => {
            if (newMovieController.getMovieData().id === movieController.getMovieData().id) {
              newMovieController.render(newMovieData);
            }
          });
        }
      })
      .catch(() => {
        if (movieController._isRatingChanging) {
          movieController._newFilmDetail.shakePersonalRating();
        }
        movieController._isRatingChanging = false;
        movieController._isFavoriteChanging = false;
        movieController._isAddToWatchListChanging = false;
        movieController._isAddToWatchListChanging = false;
        movieController._isInHistory = false;
      });
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
    this._moviesControllers = [];
    this._filmsToRender = filmsToRender;
    this._showFilmsCount = NUMBER_OF_FILMS_ADD;
    const filmsListShowMore = this._filmsListBlock.querySelector(`.films-list__show-more`);
    if (filmsListShowMore) {
      this._filmsListBlock.removeChild(filmsListShowMore);
    }

    while (this._filmsContainer.firstChild) {
      this._filmsContainer.removeChild(this._filmsContainer.firstChild);
    }
    const filmsListTitle = this._filmsListBlock.querySelector(`.films-list__title`);
    if (filmsListTitle && !filmsListTitle.classList.contains(`.visually-hidden`)) {
      this._filmsListBlock.removeChild(filmsListTitle);
    }
    if (filmsToRender.length === 0) {
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
            this._onViewChange,
            this._api
        )
    );
    const getTwoTopRates = (movies) => this.getTwoTopMovies(movies, (a, b) => b.filmMark - a.filmMark);

    const topRatedFilms = getTwoTopRates(this._movies.getMovieByFilter());
    let filmsListExtra = document.querySelector(`.films-list--extra`);
    while (filmsListExtra) {
      filmsListExtra.parentElement.removeChild(filmsListExtra);
      filmsListExtra = document.querySelector(`.films-list--extra`);
    }
    if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
      render(this._films.getElement(), new TopRated().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topRatesBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(
          renderMovies(topRatesBlock, topRatedFilms, this._onDataChange, this._onViewChange, this._api)
      );
    }
    this.renderTopCommented();
  }

  getTwoTopMovies(movies, comparator) {
    return movies.sort(comparator).slice(0, 2);
  }

  renderTopCommented() {
    const getTwoTopCommented = (movies) =>
      this.getTwoTopMovies(movies, (a, b) => b.comments.length - a.comments.length);
    const topCommentedMovies = getTwoTopCommented(this._movies.getMovieByFilter());
    if (this._mostCommented) {
      remove(this._mostCommented);
      this._mostCommented = null;
    }
    if (topCommentedMovies.length > 0 && topCommentedMovies[0].comments !== 0) {
      this._mostCommented = new MostCommented();
      render(this._films.getElement(), this._mostCommented.getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topCommentedBlock = elFilmLists[elFilmLists.length - 1];
      this._moviesControllers = this._moviesControllers.concat(
          renderMovies(topCommentedBlock, topCommentedMovies, this._onDataChange, this._onViewChange, this._api)
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
