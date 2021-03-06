import {generateGenres, getFilmDuration} from '../utils/util';
import AbstractSmartComponent from "./abstract-smart-component";
import moment from 'moment';
import numberToWords from 'number-to-words';

const SHAKE_ANIMATION_TIMEOUT = 600;

const TimeThreshold = {
  A_MINUTE_AGO: 1,
  A_FEW_MINUTES_AGO: 3,
  A_HOUR_AGO: 59,
  A_FEW_HOURS_AGO: 119
};

const getCommentedDate = (date) => {
  const dateNow = new Date();
  const duration = moment.duration(Number(dateNow) - date);

  if (duration.days() > 0) {
    return `a ${duration.days() === 1 ? `one day` : `${numberToWords.toWords(duration.days())} days`} ago`;
  } else if (duration.minutes() > TimeThreshold.A_FEW_HOURS_AGO) {
    return `a few hours ago`;
  } else if (duration.minutes() > TimeThreshold.A_HOUR_AGO) {
    return `a hour ago`;
  } else if (duration.minutes() > TimeThreshold.A_FEW_MINUTES_AGO) {
    return `a few minutes ago`;
  } else if (duration.minutes() >= TimeThreshold.A_MINUTE_AGO) {
    return `a minute ago`;
  } else {
    return `now`;
  }
};

export const renderComments = (comments, online) => {
  return comments
    .map((el) => {
      return `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${el.emoji}" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${el.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${el.user}</span>
              <span class="film-details__comment-day">${getCommentedDate(el.date)}</span>
             
             ${online ? `<button class="film-details__comment-delete" data-id = ${el.id}>${el.isDeleting ? `Deleting...` : `Delete`}</button>` : ``}
              
            </p>
          </div>
        </li>`;
    })
    .join(`\n`);
};


const addFilmDetails = (data, isInHistory, emojiImg, commentsArr, isInWatchList, isFavorite, personalRating, sendingObj, online) => {

  const {
    name,
    filmMark,
    director,
    writers,
    actors,
    releaseDate,
    runTime,
    country,
    genres,
    description,
    poster,
    ageRating
  } = data;
  const comments = commentsArr;

  const renderEmoji = () => emojiImg ? `<img src="./images/emoji/${emojiImg}.png" width="55" height="55" alt="emoji" class="film-details__add-emoji-img">` : ``;

  const getGenresName = (ganresSet) => {
    return [...ganresSet].length > 1 ? `Genres` : `Genre`;
  };

  const getPlaceInputPlaceHolder = () => {
    if (!online) {
      return `You don't have internet - Comments are unable!!!!`;
    } else {
      return sendingObj.value ? sendingObj.value : `Select reaction below and write comment here`;
    }
  };

  const renderMarks = () => {
    if (isInHistory) {
      return `  <div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${name}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 1 ? `checked` : ``} value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 2 ? `checked` : ``} value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 3 ? `checked` : ``} value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 4 ? `checked` : ``} value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 5 ? `checked` : ``} value="5" id="rating-5">
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 6 ? `checked` : ``} value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 7 ? `checked` : ``} value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 8 ? `checked` : ``} value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${personalRating === 9 ? `checked` : ``} value="9" id="rating-9">
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>
    </div>`;
    } else {
      return ``;
    }
  };

  const getReleaseDate = () => moment(releaseDate).format(`DD MMMM YYYY`);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${name}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmMark}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${[...writers].join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${[...actors].join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getReleaseDate()}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getFilmDuration(runTime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${getGenresName(genres)}</td>
              <td class="film-details__cell">
                ${generateGenres(genres)}
                </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" ${isInWatchList ? `checked` : ``} name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" ${isInHistory ? `checked` : ``} name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" ${isFavorite ? `checked` : ``} name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    
     ${renderMarks()}

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">

        ${renderComments(comments, online)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
        ${renderEmoji()}
        </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="${getPlaceInputPlaceHolder()}" name="comment" ${sendingObj.flag || !online ? `disabled` : ``}></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(data) {
    super();
    this._data = data;
    this.closeHandler = null;
    this._alreadyWatchedHandler = null;
    this._addToWatchlistHandler = null;
    this._addToFavoriteHandler = null;
    this._personalRatingHandler = null;
    this._deleteClickHandler = null;
    this._undoPersonalRatingHandler = null;
    this._onlineHandler = null;
    this._offlineHandler = null;
    this._emoji = null;
    this._isInHistory = data.isInHistory;
    this._isInWatchList = data.isInWatchList;
    this._isFavorite = data.isFavorite;
    this._personalRating = data.personalRating;
    this._comments = null;
    this._sendingObj = {flag: false, value: null};
    this.online = true;
    this._commentValue = null;
  }

  getIsWatched() {
    return this._isInHistory;
  }
  getComments() {
    return this._comments;
  }

  getTemplate() {
    return addFilmDetails(this._data, this._isInHistory, this._emoji, this._comments, this._isInWatchList, this._isFavorite, this._personalRating, this._sendingObj, this.online);
  }

  setSending(data) {
    this._sendingObj = data;
    this.rerender();
  }

  setCloseButtonClickHandler(handler) {
    this.closeHandler = handler;
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }

  recoveryListeners() {
    this.subscribeOnEvents();
    this.setCloseButtonClickHandler(this.closeHandler);
    this.setAlreadyWatchedClickHandler(this._alreadyWatchedHandler);
    this.setDeleteClickHandler(this._deleteClickHandler);
    this.setAddToWatchlistClickHandler(this._addToWatchlistHandler);
    this.setAddPersonalRatingHandler(this._personalRatingHandler);
    this.setUndoPersonalRatingHandler(this._undoPersonalRatingHandler);
    this.setAddToFavoriteClickHandler(this._addToFavoriteHandler);
    this.setOnlineHandler(this._onlineHandler);
    this.setOfflineHandler(this._offlineHandler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this._alreadyWatchedHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);

  }

  setAddToWatchlistClickHandler(handler) {
    this._addToWatchlistHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  setAddToFavoriteClickHandler(handler) {
    this._addToFavoriteHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }

  setAddPersonalRatingHandler(handler) {
    this._personalRatingHandler = handler;
    if (this._isInHistory) {
      this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, handler);
    }
  }

  setUndoPersonalRatingHandler(handler) {
    this._undoPersonalRatingHandler = handler;
    if (this._personalRating > 0 && this._isInHistory) {
      this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, handler);
    }
  }

  setDeleteClickHandler(handler) {
    this._deleteClickHandler = handler;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((el) => el.addEventListener(`click`, handler));
  }

  setOnlineHandler(handler) {

    this._onlineHandler = handler;
    window.addEventListener(`online`, handler);
  }
  setOfflineHandler(handler) {
    this._offlineHandler = handler;
    window.addEventListener(`offline`, handler);
  }

  subscribeOnEvents() {

    const emojiClickHandler = (evt) => {
      this._emoji = evt.target.value;
      const input = this.getElement().querySelector(`.film-details__comment-input`).value;
      this.rerender();
      this.getElement().querySelector(`.film-details__comment-input`).value = input;
    };

    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, emojiClickHandler);
  }

  shakeComment() {
    this.getElement().querySelector(`.film-details__comment-input`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.getElement().querySelector(`.film-details__comment-input`).style.border = `2px solid red`;
    setTimeout(() => {
      this.getElement().querySelector(`.film-details__comment-input`).style.animation = ``;
      this.setSending({flag: false, value: this._commentValue});

      this.getElement().querySelector(`.film-details__comment-input`).style.border = `none`;
      this.getElement().querySelector(`.film-details__comment-input`).value = this._commentValue;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakePersonalRating() {
    this.getElement().querySelector(`.film-details__user-rating-score`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.getElement().querySelector(`.film-details__user-rating-score`).style.border = `2px solid red`;
    setTimeout(() => {
      this.getElement().querySelector(`.film-details__user-rating-score`).style.animation = ``;
      this.rerender();
      this.getElement().querySelector(`.film-details__user-rating-score`).style.border = `none`;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
