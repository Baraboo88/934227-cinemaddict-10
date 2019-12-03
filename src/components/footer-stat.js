import {createElement} from '../util';

const addFooterStat = (number) => {
  return `<section class="footer__statistics">
    <p>${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `)} movies inside</p>
  </section>`;
};

export default class FooterStat {
  constructor(number) {
    this._element = null;
    this._number = number;
  }

  getTemplate() {
    return addFooterStat(this._number);
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
