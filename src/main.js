import Profile from './components/profile';
import FooterStat from './components/footer-stat';

import {render} from './utils/render';
import PageController from './controllers/page-controller';
import Movies from './models/movies';
import Stat from './components/stat';
import API from './api';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const api = new API(END_POINT, AUTHORIZATION);
const movies = new Movies();
let stat = null;
let pageController = null;

api.getMovies().then((moviesData) => {
  movies.setMovies(moviesData);
  stat = new Stat(movies);
  pageController = new PageController(mainBlock, movies, stat, api);
  pageController.render();
  render(headerBlock, new Profile(movies.getMovies().filter((el) => el.isInWatchList).length).getElement());
  render(mainBlock, stat.getElement());
  render(footerBlock, new FooterStat(movies.getMovies().length).getElement());
});
