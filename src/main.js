import {addProfileBlock} from './components/profile';
import {addNavigationBlock} from './components/navigation';
import {addSortBlock} from './components/sort';
import {addFilmsBlock} from './components/films';
import {addFilmCard} from './components/film-card';
import {addShowMore} from './components/show-more-button';
import {addTopRatesBlock} from './components/top-rates-component';
import {addMostComBlock} from './components/most-comm-component';
import {addFilmDetails} from './components/film-details';
import {addFooterStat} from './components/footer-stat';
import {getFilmsTemplate} from './mock/films-data';
import {generateFilters} from './mock/filters';

const NUMBER_OF_FILMS_MAIN = 3;
const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;
let showFilmsCount = NUMBER_OF_FILMS_ADD;
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const films = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);
const filters = generateFilters(films);

const render = (parentBlock, blockToAdd, position = `beforeend`) =>
  parentBlock.insertAdjacentHTML(position, blockToAdd);
const getTwoTopElOfArr = (arr, comparator) => arr.sort(comparator).slice(0, 2);
const getTwoTopRates = (arr) => getTwoTopElOfArr(arr, (a, b) => b.filmMark - a.filmMark);
const getTwoTopCommented = (arr) =>
  getTwoTopElOfArr(arr, (a, b) => b.comments.length - a.comments.length);
const closeButtonClickHandler = (event) => () => document.querySelector(`body`).removeChild(event);
const filmCardClickHandler = (el) => {
  return () => {
    render(footerBlock, addFilmDetails(el), `afterend`);
    const popUp = document.querySelector(`.film-details`);
    popUp
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, closeButtonClickHandler(popUp));
  };
};
const populateCards = (el, container) => {
  render(container, addFilmCard(el));
  const lastFilm = container.lastChild;
  lastFilm.querySelector(`.film-card__poster`).addEventListener(`click`, filmCardClickHandler(el));
};
const showMoreButtonClickHandler = () => {
  let previousShowCount = showFilmsCount;
  showFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
  films.slice(previousShowCount, showFilmsCount).forEach((el) => populateCards(el, filmsContainer));

  if (showFilmsCount >= NUMBER_OF_FILMS_MAIN) {
    filmsListBlock.removeChild(showButton);
  }
};

render(headerBlock, addProfileBlock(films.filter((el) => el.isInWatchList).length));
render(mainBlock, addNavigationBlock(filters));
render(mainBlock, addSortBlock());
render(mainBlock, addFilmsBlock());

const filmsListBlock = document.querySelector(`.films-list`);
const filmsBlock = document.querySelector(`.films`);

render(filmsListBlock, addShowMore());

const filmsContainer = document.querySelector(`.films-list__container`);

films.slice(0, NUMBER_OF_FILMS_START).forEach((el) => populateCards(el, filmsContainer));

const showButton = filmsListBlock.querySelector(`.films-list__show-more`);

showButton.addEventListener(`click`, showMoreButtonClickHandler);

const topRatedFilms = getTwoTopRates(films);
const topCommentedFilms = getTwoTopCommented(films);

if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
  render(filmsBlock, addTopRatesBlock());
  const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const topRatesBlock = elFilmLists[elFilmLists.length - 1];
  topRatedFilms.forEach((el) => populateCards(el, topRatesBlock));
}

if (topCommentedFilms.length > 0 && topCommentedFilms[0].comments !== 0) {
  render(filmsBlock, addMostComBlock());
  const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const topCommBlock = elFilmLists[elFilmLists.length - 1];
  topCommentedFilms.forEach((el) => populateCards(el, topCommBlock));
}

render(footerBlock, addFooterStat(films.length));
