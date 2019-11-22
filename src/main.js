import {addProfileBlock} from './components/profile';
import {addNavigationBlock} from './components/navigation';
import {addSortBlock} from './components/sort';
import {addFilmsBlock} from './components/films';
import {addFilmCard} from './components/film-card';
import {addShowMore} from './components/show-more-button';
import {addTopRatesBlock} from './components/top-rates-component';
import {addMostComBlock} from './components/most-comm-component';
import {addFilmDetails} from './components/film-details';

const NUMBER_OF_FILMS_MAIN = 5;

const NUMBER_OF_FILMS_ADDITIONAL = 2;

const headerBlock = document.querySelector(`.header`);

const mainBlock = document.querySelector(`.main`);

const footerBlock = document.querySelector(`.footer`);

const render = (parentBlock, blockToAdd, position = `beforeend`) =>
  parentBlock.insertAdjacentHTML(position, blockToAdd());

const repeat = (count, fn) => {
  Array(count)
    .fill(``)
    .forEach(fn);
};

render(headerBlock, addProfileBlock);

render(mainBlock, addNavigationBlock);

render(mainBlock, addSortBlock);

render(mainBlock, addFilmsBlock);

const filmsListBlock = document.querySelector(`.films-list`);

const filmsBlock = document.querySelector(`.films`);

render(filmsListBlock, addShowMore);

const filmsContainer = document.querySelector(`.films-list__container`);

repeat(NUMBER_OF_FILMS_MAIN, () => render(filmsContainer, addFilmCard));

render(filmsBlock, addTopRatesBlock);

render(filmsBlock, addMostComBlock);

const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);

for (const elFilmList of elFilmLists) {
  repeat(NUMBER_OF_FILMS_ADDITIONAL, () => render(elFilmList, addFilmCard));
}

render(footerBlock, addFilmDetails, `afterend`);
