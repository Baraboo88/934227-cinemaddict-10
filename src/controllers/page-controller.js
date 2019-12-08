import ShowMoreButton from "../components/show-more-button";
import {renderPosition} from "../utils/util";
import {render, remove} from "../utils/render";
import FilmDetails from "../components/film-details";
import FilmsCard from "../components/film-card";
import NoMovies from "../components/no-movies";
import TopRated from "../components/top-rated";
import MostCommented from "../components/most-commented";
import Films from "../components/films";
import Sort, {sortTypes} from "../components/sort";


const NUMBER_OF_FILMS_START = 5;
const NUMBER_OF_FILMS_ADD = 5;

export default class PageController {
  constructor(elementToJoin) {
    this._elementToJoin = elementToJoin;
    this._showMoreButton = new ShowMoreButton();
    this._films = new Films();
    this._sort = new Sort();
  }

  render(filmsData) {
    const footerBlock = document.querySelector(`.footer`);
    let showFilmsCount = NUMBER_OF_FILMS_ADD;
    const getTwoTopElOfArr = (arr, comparator) => arr.sort(comparator).slice(0, 2);
    const getTwoTopRates = (arr) => getTwoTopElOfArr(arr, (a, b) => b.filmMark - a.filmMark);
    const getTwoTopCommented = (arr) =>
      getTwoTopElOfArr(arr, (a, b) => b.comments.length - a.comments.length);

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
        const newFilmDetail = new FilmDetails(el);
        render(footerBlock, newFilmDetail.getElement(), renderPosition.AFTEREND);
        document.addEventListener(`keydown`, escPressHandler(newFilmDetail));
        newFilmDetail.setCloseButtonClickHandler(closeButtonClickHandler(newFilmDetail));
      };
    };
    const populateCards = (el, container) => {
      const newCard = new FilmsCard(el);
      render(container, newCard.getElement());
      newCard.setCardPosterClickHandler(filmCardClickHandler(el));
      newCard.setCardTitleClickHandler(filmCardClickHandler(el));
      newCard.setCardCommentsClickHandler(filmCardClickHandler(el));

    };
    const showMoreButtonClickHandler = () => {
      let previousShowCount = showFilmsCount;
      showFilmsCount = previousShowCount + NUMBER_OF_FILMS_ADD;
      filmsData
        .slice(previousShowCount, showFilmsCount)
        .forEach((el) => populateCards(el, filmsContainer));

      if (showFilmsCount >= filmsData.length) {
        remove(this._showMoreButton);
      }
    };
    render(this._elementToJoin, this._sort.getElement());
    render(this._elementToJoin, this._films.getElement());
    const filmsListBlock = document.querySelector(`.films-list`);
    const filmsContainer = document.querySelector(`.films-list__container`);
    const renderFilms = (filmsToRender) => {
      showFilmsCount = NUMBER_OF_FILMS_ADD;
      while (filmsContainer.firstChild) {
        filmsContainer.removeChild(filmsContainer.firstChild);
      }
      if (filmsToRender.length === 0) {
        render(filmsListBlock, new NoMovies().getElement());
      } else if (filmsData.length > showFilmsCount) {
        render(filmsListBlock, this._showMoreButton.getElement());
        this._showMoreButton.setShowMoreButtonClickHandler(showMoreButtonClickHandler);
      }

      filmsToRender.slice(0, NUMBER_OF_FILMS_START).forEach((el) => populateCards(el, filmsContainer));
    };

    const sortClickHandler = (sortType) => {
      let sortedFilms = [...filmsData];
      switch (sortType) {
        case sortTypes.DEFAULT:
          renderFilms(filmsData);
          break;
        case sortTypes.BY_DATE:
          renderFilms(sortedFilms.sort((a, b) => b.releaseDate - a.releaseDate));
          break;
        case sortTypes.BY_RATING:
          renderFilms(sortedFilms.sort((a, b) => b.filmMark - a.filmMark));
          break;
      }
    };

    this._sort.setFilterClickHandler(sortClickHandler);

    renderFilms(filmsData);

    const topRatedFilms = getTwoTopRates(filmsData);
    const topCommentedFilms = getTwoTopCommented(filmsData);

    if (topRatedFilms.length > 0 && topRatedFilms[0].filmMark !== 0) {
      render(this._films.getElement(), new TopRated().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topRatesBlock = elFilmLists[elFilmLists.length - 1];
      topRatedFilms.forEach((el) => populateCards(el, topRatesBlock));
    }

    if (topCommentedFilms.length > 0 && topCommentedFilms[0].comments !== 0) {
      render(this._films.getElement(), new MostCommented().getElement());
      const elFilmLists = document.querySelectorAll(`.films-list--extra .films-list__container`);
      const topRatesBlock = elFilmLists[elFilmLists.length - 1];
      topCommentedFilms.forEach((el) => populateCards(el, topRatesBlock));
    }
  }
}
