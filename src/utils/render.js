import {renderPosition} from "./util";

export const render = (container, element, place = renderPosition.BEFOREEND) => {
  switch (place) {
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
    case renderPosition.AFTEREND:
      container.insertAdjacentElement(renderPosition.AFTEREND, element);
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
