import {getFilmDuration} from '../utils/util';
import {generateGenres} from '../utils/util';
import AbstractComponent from "./abstract-component";

const addFilmCard = (card) => {
  const {name, filmMark, releaseDate, runTime, genres, description, poster, comments, isFavorite, isInWatchList, isInHistory} = card;

  const getDescription = () => description.length > 140 ? `${description.slice(0, 140)} ...` : description;

  const isInWatchlistActive = isInWatchList ? `film-card__controls-item--active` : ``;
  const isInFavoriteActive = isFavorite ? `film-card__controls-item--active` : ``;
  const isInWatchedActive = isInHistory ? `film-card__controls-item--active` : ``;

  return `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${filmMark}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${getFilmDuration(runTime)}</span>
            <span class="film-card__genre">${generateGenres(genres)}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getDescription()}</p>
          <a class="film-card__comments">${comments.length} ${comments.length > 1 ? `comments` : `comment`}</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isInWatchlistActive}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isInWatchedActive}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${isInFavoriteActive}">Mark as favorite</button>
          </form> 
        </article>`;
};

export default class FilmCard extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return addFilmCard(this._card);
  }

  setCardPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setCardTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCardCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setAddToFavoritesClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

}
