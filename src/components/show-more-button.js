import AbstractComponent from "./abstract-component";

const addShowMore = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return addShowMore();
  }

  setShowMoreButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
