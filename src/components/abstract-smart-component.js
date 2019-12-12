import AbstractComponent from "./abstract-component";

export default class AbstractSmartController extends AbstractComponent {

  recoveryListeners() {
    throw new Error(`method should be overwritten: _recoveryListeners`);
  }

  rerender() {
    const prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    prevElement.parentElement.replaceChild(newElement, prevElement);
    this.recoveryListeners();
  }
}
