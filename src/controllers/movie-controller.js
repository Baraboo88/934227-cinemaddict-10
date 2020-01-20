import FilmsCard from "../components/film-card";
import {remove, render, replace} from "../utils/render";
import FilmDetails from "../components/film-details";
import {RenderPosition} from "../utils/util";
import Movie from "../models/movie";
import debounce from 'lodash/debounce';
const DEBOUNCE_TIMEOUT = 500;

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {

  constructor(container, onDataChange, onViewChange, api) {
    this._footerBlock = document.querySelector(`.footer`);
    this._container = container;
    this._onDataChange = onDataChange;
    this._api = api;
    this._newCard = null;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._newFilmDetail = null;
    this._movie = null;
    this._isRatingChanging = false;
    this._isFavoriteChanging = false;
    this._isAddToWatchListChanging = false;
    this._isDeleteChanging = false;
    this._isInHistory = false;
    this.commentAddingPressHandler = this.commentAddingPressHandler.bind(this);
    this.escPressHandler = this.escPressHandler.bind(this);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._newFilmDetail);
      this._newFilmDetail.removeElement();
      this._mode = Mode.DEFAULT;
      document.removeEventListener(`keydown`, this.commentAddingPressHandler);
    }
  }

   commentAddingPressHandler(event) {
    const key = event.key;
    if ((event.ctrlKey || event.metaKey) && key === `Enter`) {
      const input = this._newFilmDetail.getElement().querySelector(`.film-details__comment-input`).value;
      const imageAddress = this._newFilmDetail.getElement().querySelector(`.film-details__add-emoji-img`).src.split(`/`);
      const image = imageAddress[imageAddress.length - 1];
      if (input.trim() !== ``) {
        const commentObj = {
          comment: input,
          date: new Date().toISOString(),
          emotion: image.split(`.`).shift()
        };
        this._newFilmDetail.setSending({flag: true, value: input});
        this._newFilmDetail._commentValue = input;
        this._onDataChange(this, this._movie, commentObj, this._newFilmDetail);
      }

    }
  };
  closeButtonClickHandler(element) {
    return () => {
      this.closePopUp(element);
      document.removeEventListener(`keydown`, this.commentAddingPressHandler);
      document.removeEventListener(`keydown`, this.escPressHandler);
      window.removeEventListener(`online`, this.onlineHandler);
      window.removeEventListener(`offline`, this.offlineHandler);
    };
  }

  escPressHandler(event) {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;
    if (isEscKey) {
      this.closePopUp(this._newFilmDetail);
      document.removeEventListener(`keydown`, this.escPressHandler);
      document.removeEventListener(`keydown`, this.commentAddingPressHandler);
    }
  };

  closePopUp(element) {
    remove(element);
  }

  getMovieData() {
    return this._movie;
  }

  onlineHandler() {
    this._newFilmDetail.online = true;
    this._newFilmDetail.rerender();
  };
  offlineHandler() {
    this._newFilmDetail.online = false;
    this._newFilmDetail.rerender();
  };

  render(movie) {
    this._movie = movie;
    const prevCard = this._newCard;

    this._newCard = new FilmsCard(movie);

     const alreadyWatchedDebounce = debounce(() => {
      const watchedDateNow = this._newFilmDetail.getIsWatched() ? new Date() : this._movie.whatchedDate;
      const newMovie = Movie.clone(movie);
      this._isInHistory = true;
      newMovie.isInHistory = !this._newFilmDetail._isInHistory;
      newMovie.whatchedDate = watchedDateNow;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);

    const alreadyWatchedClickHandler = (evt) => {
      evt.preventDefault();
      alreadyWatchedDebounce();
    };

    const addToWatchlistDebounced = debounce(() => {
      this._isAddToWatchListChanging = true;
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchList = !this._newFilmDetail._isInWatchList;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);

    const addToWatchlistClickHandler = (evt) => {
      evt.preventDefault();
      addToWatchlistDebounced();
    };

    const addToFavoriteDebounce = debounce(() => {
      const newMovie = Movie.clone(movie);
      this._isFavoriteChanging = true;
      newMovie.isFavorite = !this._newFilmDetail._isFavorite;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);

    const addToFavoriteClickHandler = (evt) => {
      evt.preventDefault();
      addToFavoriteDebounce();
    };

    const addPersonalRatingHandler = (evt) => {
      if (evt.target.value) {
        this._isRatingChanging = true;
        const mark = evt.target.value;
        const newMovie = Movie.clone(movie);
        newMovie.personalRating = mark * 1;
        this._onDataChange(this, movie, newMovie);
      }
    };

    const undoPersonalRatingHandler = () => {
      this._newFilmDetail._personalRating = 0;
      const newMovie = Movie.clone(movie);
      newMovie.personalRating = this._newFilmDetail._personalRating;
      this._onDataChange(this, movie, newMovie);
      this._newFilmDetail.rerender();
    };

    const deleteClickHandler = (evt) => {
      evt.preventDefault();
      this._isDeleteChanging = true;
      const comment = this._newFilmDetail._comments.find((el) => el.id === evt.target.dataset.id);
      if (comment) {
        comment.isDeleting = true;
      }
      this._newFilmDetail.rerender();
      this._onDataChange(this, evt.target.dataset.id, null, this._newFilmDetail);
    };

    const filmCardClickHandler = (el) => {
      return () => {
        this._onViewChange();

        this._api.getComments(this._movie.id)
          .then((comments) => {
            this._newFilmDetail = new FilmDetails(el);
            if (window.navigator.onLine) {
              this._newFilmDetail.online = true;
            } else {
              this._newFilmDetail.online = false;
            }
            this._newFilmDetail._comments = comments;
            this._newFilmDetail.subscribeOnEvents();
            this._newFilmDetail.setAlreadyWatchedClickHandler(alreadyWatchedClickHandler);
            this._newFilmDetail.setAddToWatchlistClickHandler(addToWatchlistClickHandler);
            this._newFilmDetail.setAddToFavoriteClickHandler(addToFavoriteClickHandler);
            this._newFilmDetail.setAddPersonalRatingHandler(addPersonalRatingHandler);
            this._newFilmDetail.setUndoPersonalRatingHandler(undoPersonalRatingHandler);
            this._newFilmDetail.setDeleteClickHandler(deleteClickHandler);
            this._newFilmDetail.setOnlineHandler(this.onlineHandler);
            this._newFilmDetail.setOfflineHandler(this.offlineHandler);
            render(this._footerBlock, this._newFilmDetail.getElement(), RenderPosition.AFTEREND);
            this._mode = Mode.POPUP;
            document.addEventListener(`keydown`, this.escPressHandler);
            document.addEventListener(`keydown`, this.commentAddingPressHandler);

            this._newFilmDetail.setCloseButtonClickHandler(this.closeButtonClickHandler(this._newFilmDetail));
          });

      };
    };

    const movieCardAlreadyWatchedDebounce = debounce(() => {
      const watchedNow = !movie.isInHistory ? new Date() : movie.whatchedDate;
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;
      newMovie.whatchedDate = watchedNow;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);

    const movieCardAlreadyWatchedClickHandler = (evt) => {
      evt.preventDefault();
      movieCardAlreadyWatchedDebounce();
    };

    const movieCardAddToWatchlistDebounce = debounce(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchList = !movie.isInWatchList;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);
    const movieCardAddToWatchlistClickHandler = (evt) => {
      evt.preventDefault();
      movieCardAddToWatchlistDebounce();
    };

    const movieAddToFavoritesDebounce = debounce(() => {
      const newMovie = Movie.clone(movie);
      newMovie.isFavorite = !movie.isFavorite;
      this._onDataChange(this, movie, newMovie);
    }, DEBOUNCE_TIMEOUT);
    const movieAddToFavoritesClickHandler = (evt) => {
      evt.preventDefault();
      movieAddToFavoritesDebounce();
    };

    this._newCard.setCardPosterClickHandler(filmCardClickHandler(movie));
    this._newCard.setCardTitleClickHandler(filmCardClickHandler(movie));
    this._newCard.setCardCommentsClickHandler(filmCardClickHandler(movie));
    this._newCard.setAddToWatchlistClickHandler(movieCardAddToWatchlistClickHandler);

    this._newCard.setAlreadyWatchedClickHandler(movieCardAlreadyWatchedClickHandler);
    this._newCard.setAddToFavoritesClickHandler(movieAddToFavoritesClickHandler);

    if (prevCard) {
      replace(this._newCard.getElement(), prevCard.getElement());
    } else {
      render(this._container, this._newCard.getElement());
    }
  }


}
