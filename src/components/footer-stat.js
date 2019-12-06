import AbstractComponent from "./abstract-component";

const addFooterStat = (number) => {
  return `<section class="footer__statistics">
    <p>${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `)} movies inside</p>
  </section>`;
};

export default class FooterStat extends AbstractComponent {
  constructor(number) {
    super();
    this._number = number;
  }

  getTemplate() {
    return addFooterStat(this._number);
  }

}
