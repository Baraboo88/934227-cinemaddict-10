import FilmsCard from "../components/film-card";
import {remove, render, replace} from "../utils/render";
import FilmDetails from "../components/film-details";
import {renderPosition} from "../utils/util";
import {getRandomArrayElement, usersNames} from './../utils/util';
import Movie from "../models/movie";

const mode = {
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
    this._mode = mode.DEFAULT;
    this._newFilmDetail = null;
    this._movie = null;
  }

  setDefaultView() {
    if (this._mode !== mode.DEFAULT) {
      this._newFilmDetail.removeElement();
      this._mode = mode.DEFAULT;
    }
  }

  getMovieData() {
    return this._movie;
  }

  render(movie) {
    this._movie = movie;
    const prevCard = this._newCard;

    this._newCard = new FilmsCard(movie);

    const closePopUp = (element) => {
      remove(element);
    };

    const closeButtonClickHandler = (element) => () => {
      closePopUp(element);
      document.removeEventListener(`keydown`, commentAddingPressHandler);
    };

    const escPressHandler = (event) => {

      const isEscKey = event.key === `Escape` || event.key === `Esc`;
      if (isEscKey) {

        closePopUp(this._newFilmDetail);
        document.removeEventListener(`keydown`, escPressHandler);
        document.removeEventListener(`keydown`, commentAddingPressHandler);
      }

    };

    const commentAddingPressHandler = (event) => {
      const key = event.key;

      if ((event.ctrlKey || event.metaKey) && key === `Enter`) {
        const input = this._newFilmDetail.getElement().querySelector(`.film-details__comment-input`).value;
        const imageAddress = this._newFilmDetail.getElement().querySelector(`.film-details__add-emoji-img`).src.split(`/`);
        const image = imageAddress[imageAddress.length - 1];
        if (input.trim() !== ``) {
          const commentObj = {
            user: getRandomArrayElement(usersNames),
            comment: input,
            date: new Date(),
            emoji: image
          };
          this._newFilmDetail.addComment(commentObj);

          this._onDataChange(this, this._movie, Object.assign({}, this._movie, {comments: this._newFilmDetail.getComments()}))();

          this._newFilmDetail.rerender();
        }

      }
    };

    const alreadyWatchedClickHandler = () => {
      this._newFilmDetail._isInHistory = !this._newFilmDetail._isInHistory;
      const watchedDateNow = this._newFilmDetail.getIsWached() ? new Date() : this._movie.whatchedDate;
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = this._newFilmDetail.getIsWached();
      newMovie.whatchedDate = watchedDateNow;
      this._onDataChange(this, movie, newMovie);
      this._newFilmDetail.rerender();
    };

    const addToWatchlistClickHandler = () => {
      this._newFilmDetail._isInWatchList = !this._newFilmDetail._isInWatchList;
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchList = !movie.isInWatchList;
      this._onDataChange(this, movie, newMovie);
      this._newFilmDetail.rerender();
    };

    const addToFavoriteClickHandler = () => {
      this._newFilmDetail._isFavorite = !this._newFilmDetail._isFavorite;
      const newMovie = Movie.clone(movie);
      newMovie.isFavorite = !movie.isFavorite;
      this._onDataChange(this, movie, newMovie);
      this._newFilmDetail.rerender();
    };

    const addPersonalRatingHandler = (evt) => {
      if (evt.target.value) {
        const mark = evt.target.value;
        this._newFilmDetail._personalRating = mark * 1;
        const newMovie = Movie.clone(movie);
        newMovie.personalRating = this._newFilmDetail._personalRating;
        this._onDataChange(this, movie, newMovie);
        this._newFilmDetail.rerender();
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
      this._onDataChange(this, evt.target.dataset.id, null)();
      this._newFilmDetail._comments = this._movie.comments;
      this._newFilmDetail.rerender();
    };

    const filmCardClickHandler = (el) => {
      return () => {
        this._onViewChange();

        this._api.getComments(this._movie.id)
          .then((comments) => {
            this._newFilmDetail = new FilmDetails(el);
            this._newFilmDetail._comments = comments;
            this._newFilmDetail.subscribeOnEvents();
            this._newFilmDetail.setAlreadyWatchedClickHandler(alreadyWatchedClickHandler);
            this._newFilmDetail.setAddToWatchlistClickHandler(addToWatchlistClickHandler);
            this._newFilmDetail.setAddToFavoriteClickHandler(addToFavoriteClickHandler);
            this._newFilmDetail.setAddPersonalRatingHandler(addPersonalRatingHandler);
            this._newFilmDetail.setUndoPersonalRatingHandler(undoPersonalRatingHandler);
            this._newFilmDetail.setDeleteClickHandler(deleteClickHandler);

            render(this._footerBlock, this._newFilmDetail.getElement(), renderPosition.AFTEREND);
            this._mode = mode.POPUP;
            document.addEventListener(`keydown`, escPressHandler);
            document.addEventListener(`keydown`, commentAddingPressHandler);

            this._newFilmDetail.setCloseButtonClickHandler(closeButtonClickHandler(this._newFilmDetail));
          });

      };
    };
    const movieCardAlreadyWatchedClickHandler = (evt) => {
      evt.preventDefault();
      const watchedNow = !movie.isInHistory ? new Date() : movie.whatchedDate;
      const newMovie = Movie.clone(movie);
      newMovie.isInHistory = !movie.isInHistory;
      newMovie.whatchedDate = watchedNow;
      this._onDataChange(this, movie, newMovie);
    };

    const movieCardAddToWatchlistClickHandler = (evt) => {
      evt.preventDefault();
      const newMovie = Movie.clone(movie);
      newMovie.isInWatchList = !movie.isInWatchList;
      this._onDataChange(this, movie, newMovie);
    };

    const movieAddToFavoritesClickHandler = (evt) => {
      evt.preventDefault();
      const newMovie = Movie.clone(movie);
      newMovie.isFavorite = !movie.isFavorite;
      this._onDataChange(this, movie, newMovie);
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
