import {getFilmDuration} from './../util';
import {generateGenres} from './../util';

export const addFilmCard = (card) => {
  const {
    name,
    filmMark,
    releaseDate,
    runTime,
    genres,
    description,
    poster,
    comments
  } = card;

  return `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${filmMark}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${getFilmDuration(runTime)}</span>
            <span class="film-card__genre">${generateGenres(genres)}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${comments.length} ${comments.length > 1 ? `comments` : `comment`}</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
          </form> 
        </article>`;
};
