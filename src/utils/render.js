import {RenderPosition} from "./util";

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(RenderPosition.AFTEREND, element);
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newElement, oldElement) => {
  oldElement.parentElement.replaceChild(newElement, oldElement);
};
