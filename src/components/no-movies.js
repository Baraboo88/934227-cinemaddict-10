import {createElement} from '../util';

const createNoMovieTemplate = () =>
  `<h2 class="films-list__title">There are no movies in our database</h2>`;

export default class NoMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoMovieTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
