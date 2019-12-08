import Profile from './components/profile';
import Navigation from './components/navigation';
import FooterStat from './components/footer-stat';
import {getFilmsTemplate} from './mock/films-data';
import {generateFilters} from './mock/filters';
import {render} from './utils/render';
import PageController from "./controllers/page-controller";


const NUMBER_OF_FILMS_MAIN = 6;

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);
const footerBlock = document.querySelector(`.footer`);
const filmsData = getFilmsTemplate(NUMBER_OF_FILMS_MAIN);
const filters = generateFilters(filmsData);
const pageController = new PageController(mainBlock);

render(headerBlock, new Profile(filmsData.filter((el) => el.isInWatchList).length).getElement());
render(mainBlock, new Navigation(filters).getElement());

pageController.render(filmsData);

render(footerBlock, new FooterStat(filmsData.length).getElement());
