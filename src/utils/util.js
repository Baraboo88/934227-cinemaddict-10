
import moment from 'moment';

export const MovieOfflineStatus = {
  INITIAL: `initial`,
  UPDATED: `updated`
};

export const FilterTypes = {
  ALL: `all`,
  WHATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const RenderPosition = {
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const getFilmDuration = (runTime) => {
  const momentDuration = moment.duration(runTime);
  return `${momentDuration.hours()}h ${momentDuration.minutes()}m`;
};

export const generateGenres = (genres) => {
  return [...genres]
    .map((el) => {
      return `<span class="film-details__genre">${el}</span>`;
    })
    .join(`\n`);
};

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const createElement = (element) => {
  const wrapElem = document.createElement(`div`);
  wrapElem.innerHTML = element;

  return wrapElem.firstChild;
};

