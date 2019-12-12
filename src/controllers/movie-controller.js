import FilmsCard from "../components/film-card";
import {remove, render, replace} from "../utils/render";
import FilmDetails from "../components/film-details";
import {renderPosition} from "../utils/util";


const mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {

  constructor(container, onDataChange, onViewChange) {
    this._footerBlock = document.querySelector(`.footer`);
    this._container = container;
    this._onDataChange = onDataChange;
    this._newCard = null;
    this._onViewChange = onViewChange;
    this._mode = mode.DEFAULT;
    this._newFilmDetail = null;
  }

  setDefaultView() {
    if (this._mode !== mode.DEFAULT) {
      this._newFilmDetail.removeElement();
      this._mode = mode.DEFAULT;
    }
  }

  render(movie) {
    const prevCard = this._newCard;

    this._newCard = new FilmsCard(movie);

    const closePopUp = (element) => {
      remove(element);
    };

    const closeButtonClickHandler = (element) => () => {
      closePopUp(element);
    };

    const escPressHandler = (element) => (event) => {
      const isEscKey = event.key === `Escape` || event.key === `Esc`;
      if (isEscKey) {
        closePopUp(element);
        document.removeEventListener(`keydown`, escPressHandler);
      }
    };

    const filmCardClickHandler = (el) => {
      return () => {
        this._onViewChange();
        this._newFilmDetail = new FilmDetails(el);
        render(this._footerBlock, this._newFilmDetail.getElement(), renderPosition.AFTEREND);
        this._mode = mode.POPUP;
        document.addEventListener(`keydown`, escPressHandler(this._newFilmDetail));
        this._newFilmDetail.setCloseButtonClickHandler(closeButtonClickHandler(this._newFilmDetail));
      };
    };


    this._newCard.setCardPosterClickHandler(filmCardClickHandler(movie));
    this._newCard.setCardTitleClickHandler(filmCardClickHandler(movie));
    this._newCard.setCardCommentsClickHandler(filmCardClickHandler(movie));
    this._newCard.setAddToWatchlistClickHandler(this._onDataChange(this, movie, Object.assign({}, movie, {isInWatchList: !movie.isInWatchList})));
    this._newCard.setAlreadyWatchedClickHandler(this._onDataChange(this, movie, Object.assign({}, movie, {isInHistory: !movie.isInHistory})));
    this._newCard.setAddToFavoritesClickHandler(this._onDataChange(this, movie, Object.assign({}, movie, {isFavorite: !movie.isFavorite})));

    if (prevCard) {
      replace(this._newCard.getElement(), prevCard.getElement());
    } else {
      render(this._container, this._newCard.getElement());
    }
  }
}
