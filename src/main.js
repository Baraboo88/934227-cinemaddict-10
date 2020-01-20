import Profile from './components/profile';
import FooterStat from './components/footer-stat';

import {remove, render} from './utils/render';
import PageController from './controllers/page-controller';
import Movies from './models/movies';
import Stat from './components/stat';
import API from './api/index';
import Store from './api/store';
import Provider from './api/provider';
import Loading from "./components/loading";

const STORE_PREFIX = `cinnemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const AUTHORIZATION = `Basic ${randomString}`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      document.title += `[]`;
    }).catch(() => {
    });
});

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const movies = new Movies();
let stat = null;
let pageController = null;
const title = document.title;
const loading = new Loading();

render(mainBlock, loading.getElement());

apiWithProvider.getMovies().then((moviesData) => {
  remove(loading);
  movies.setMovies(moviesData);
  stat = new Stat(movies);
  pageController = new PageController(mainBlock, movies, stat, apiWithProvider);
  pageController.render();
  render(headerBlock, new Profile(movies.getMovies().filter((el) => el.isInWatchList).length).getElement());
  render(mainBlock, stat.getElement());
  render(footerBlock, new FooterStat(movies.getMovies().length).getElement());
});

window.addEventListener(`online`, () => {
  document.title = title;

  if (!apiWithProvider.isSynchronized()) {
    apiWithProvider.sync().then((updatedMovies) => {
      updatedMovies.forEach((movie) => {
        movies.updateMovie(movie.id, movie);
      });
    });
  }
});

window.addEventListener(`offline`, () => {
  document.title = `${title} [offline]`;
});
