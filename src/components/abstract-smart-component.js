import AbstractComponent from "./abstract-component";

export default class AbstractSmartController extends AbstractComponent {

  recoveryListeners() {
    throw new Error(`method should be overwritten: _recoveryListeners`);
  }

  rerender() {
    const prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    prevElement.querySelector(`.film-details__inner`).parentElement.replaceChild(newElement.querySelector(`.film-details__inner`), prevElement.querySelector(`.film-details__inner`));
    this.setElement(prevElement);
    this.recoveryListeners();
  }
}
