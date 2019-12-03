import Profile from './components/profile';
import Navigation from './components/navigation';
import Sort from './components/sort';
import Films from './components/films';
import FilmsCard from './components/film-card';
import ShowMoreButton from './components/show-more-button';
import TopRated from './components/top-rated';
import MostCommented from './components/most-commented';
import FilmDetails from './components/film-details';
import FooterStat from './components/footer-stat';
import {getFilmsTemplate} from './mock/films-data';
import {generateFilters} from './mock/filters';
import {render} from './util';
import {renderPosition} from './util';

const NUMBER_OF_FILMS_MAIN = 3;
const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;
let showFilmsCount = NUMBER_OF_FILMS_ADD;
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const filmsData = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);
const filters = generateFilters(filmsData);
const showMoreButton = new ShowMoreButton();

const getTwoTopElOfArr = (arr, comparator) => arr.sort(comparator).slice(0, 2);
const getTwoTopRates = (arr) => getTwoTopElOfArr(arr, (a, b) => b.filmMark - a.filmMark);
const getTwoTopCommented = (arr) =>
  getTwoTopElOfArr(arr, (a, b) => b.comments.length - a.comments.length);
const closeButtonClickHandler = (element) => () => {
  element.getElement().remove();
  element.removeElement();
};
const filmCardClickHandler = (el) => {
  return () => {
    const newFilmDetail = new FilmDetails(el);
    render(footerBlock, newFilmDetail.getElement(), renderPosition.AFTEREND);
    newFilmDetail.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, closeButtonClickHandler(newFilmDetail));
  };
};
const populateCards = (el, container) => {
  const newCard = new FilmsCard(el);
  render(container, newCard.getElement());
  newCard.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, filmCardClickHandler(el));
  newCard.getElement().querySelector(`.film-card__title`).addEventListener(`click`, filmCardClickHandler(el));
  newCard.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, filmCardClickHandler(el));
};
const showMoreButtonClickHandler = () => {
  let previousShowCount = showFilmsCount;
  showFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
  filmsData.slice(previousShowCount, showFilmsCount).forEach((el) => populateCards(el, filmsContainer));

  if (showFilmsCount >= NUMBER_OF_FILMS_MAIN) {
    showMoreButton.getElement().remove();
    showMoreButton.removeElement();
  }
};
render(headerBlock, new Profile(filmsData.filter((el) => el.isInWatchList).length).getElement());
render(mainBlock, new Navigation(filters).getElement());
render(mainBlock, new Sort().getElement());

const films = new Films();

render(mainBlock, films.getElement());


const filmsListBlock = document.querySelector(`.films-list`);

render(filmsListBlock, showMoreButton.getElement());

const filmsContainer = document.querySelector(`.films-list__container`);

filmsData.slice(0, NUMBER_OF_FILMS_START).forEach((el) => populateCards(el, filmsContainer));

showMoreButton.getElement().addEventListener(`click`, showMoreButtonClickHandler);

const topRatedFilms = getTwoTopRates(filmsData);
const topCommentedFilms = getTwoTopCommented(filmsData);

if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
  render(films.getElement(), new TopRated().getElement());
  const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const topRatesBlock = elFilmLists[elFilmLists.length - 1];
  topRatedFilms.forEach((el) => populateCards(el, topRatesBlock));
}

if (topCommentedFilms.length > 0 && topCommentedFilms[0].comments !== 0) {
  render(films.getElement(), new MostCommented().getElement());
  const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
  const topRatesBlock = elFilmLists[elFilmLists.length - 1];
  topCommentedFilms.forEach((el) => populateCards(el, topRatesBlock));
}

render(footerBlock, new FooterStat(filmsData.length).getElement());
