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

const NUMBER_OF_FILMS_MAIN = 300;

const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;

let shosFilmsCount = NUMBER_OF_FILMS_ADD;

const headerBlock = document.querySelector(`.header`);

const mainBlock = document.querySelector(`.main`);

const footerBlock = document.querySelector(`.footer`);

const films = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);

const filters = generateFilters(films);

const render = (parentBlock, blockToAdd, position = `beforeend`) =>
  parentBlock.insertAdjacentHTML(position, blockToAdd);

render(headerBlock, addProfileBlock(films.filter((el) => el.isInWatchList).length));

render(mainBlock, addNavigationBlock(filters));

render(mainBlock, addSortBlock());

render(mainBlock, addFilmsBlock());

const filmsListBlock = document.querySelector(`.films-list`);

const filmsBlock = document.querySelector(`.films`);

render(filmsListBlock, addShowMore());

const filmsContainer = document.querySelector(`.films-list__container`);

const populateCard = (el, container) => {
  render(container, addFilmCard(el));
  const lastFilm = container.lastChild;
  lastFilm.querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    render(footerBlock, addFilmDetails(el), `afterend`);
    const popUp = document.querySelector(`.film-details`);
    popUp
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, () => document.querySelector(`body`).removeChild(popUp));
  });
};

films.slice(0, NUMBER_OF_FILMS_START).forEach((el) => populateCard(el, filmsContainer));

const showButton = filmsListBlock.querySelector(`.films-list__show-more`);

const popupCloseButtonHanler = (elem) => {
  elem
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => document.querySelector(`body`).removeChild(elem));
};

showButton.addEventListener(`click`, () => {
  let previousShowCount = shosFilmsCount;
  shosFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
  films.slice(previousShowCount, shosFilmsCount).forEach((el) => {
    render(filmsContainer, addFilmCard(el));
    const lastFilm = filmsContainer.lastChild;
    lastFilm.querySelector(`.film-card__poster`).addEventListener(`click`, () => {
      render(footerBlock, addFilmDetails(el), `afterend`);
      const popUp = document.querySelector(`.film-details`);
      popupCloseButtonHanler(popUp);
    });
  });

  if (shosFilmsCount >= NUMBER_OF_FILMS_MAIN) {
    filmsListBlock.removeChild(showButton);
  }
});

render(filmsBlock, addTopRatesBlock());

render(filmsBlock, addMostComBlock());
render(footerBlock, addFooterStat(films.length));
const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);

const getTwoTopRates = (arr) => {
  return arr
    .sort((a, b) => {
      if (b.filmMark > a.filmMark) {
        return 1;
      }
      if (b.filmMark < a.filmMark) {
        return -1;
      }
      return 0;
    })
    .slice(0, 2);
};

const getTwoTopCommented = (arr) => {
  return arr
    .sort((a, b) => {
      if (b.comments.length > a.comments.length) {
        return 1;
      }
      if (b.comments.length < a.comments.length) {
        return -1;
      }
      return 0;
    })
    .slice(0, 2);
};

getTwoTopRates(films).forEach((el) => populateCard(el, elFilmLists[0]));
getTwoTopCommented(films).forEach((el) => populateCard(el, elFilmLists[1]));
