import Profile from './components/profile';
import FooterStat from './components/footer-stat';
import {getFilmsTemplate} from './mock/films-data';
import {render} from './utils/render';
import PageController from './controllers/page-controller';
import Movies from './models/movies';
import Stat from './components/stat';


const NUMBER_OF_FILMS_MAIN = 6;

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const filmsData = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);
const movies = new Movies();
const stat = new Stat(movies.getMovies);
let prevNav = null;
movies.setMovies(filmsData);
const pageController = new PageController(mainBlock, movies);

render(headerBlock, new Profile(filmsData.filter((el) => el.isInWatchList).length).getElement());

pageController.render();

render(mainBlock, stat.getElement());

const mainNavigation = mainBlock.querySelector(`.main-navigation`);

const clickNavHandler = (evt) => {
  if (evt.target.href === `http://localhost:8080/#stats`) {
    pageController.hide();
    stat.show();
    stat.renderChart()
    prevNav = stat;

  } else if (prevNav) {
    stat.hide();
    pageController.show();
    prevNav = null;
  }
};

mainNavigation.addEventListener(`click`, clickNavHandler);

render(footerBlock, new FooterStat(filmsData.length).getElement());
