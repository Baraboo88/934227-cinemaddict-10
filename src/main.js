import Profile from './components/profile';
import FooterStat from './components/footer-stat';
import {getFilmsTemplate} from './mock/films-data';
import {render} from './utils/render';
import PageController from "./controllers/page-controller";
import Movies from './models/movies';


const NUMBER_OF_FILMS_MAIN = 6;

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const filmsData = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);
const movies = new Movies();
movies.setMovies(filmsData);
const pageController = new PageController(mainBlock, movies);

render(headerBlock, new Profile(filmsData.filter((el) => el.isInWatchList).length).getElement());


pageController.render();

render(footerBlock, new FooterStat(filmsData.length).getElement());
