export const monthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

export const renderPosition = {
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const getFilmDuration = (runTime) =>
  `${Math.floor(runTime / 60)}h ${runTime % 60 < 10 ? `0` + (runTime % 60) : runTime % 60}`;

export const generateGenres = (genres) => {
  return [...genres]
    .map((el) => {
      return `<span class="film-details__genre">${el}</span>`;
    })
    .join(`\n`);
};

export const getRandomArrayElement = (arr) => {
  return arr[getRandomNumber(arr.length - 1)];
};

export const getRandomNumber = (maxIncluded, min = 0) => {
  return min + Math.floor(Math.random() * (maxIncluded - min + 1));
};

export const shuffleArray = (arr) => {
  let j;
  let temp;

  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  return arr;
};

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const createElement = (element) => {
  const wrapElem = document.createElement(`div`);
  wrapElem.innerHTML = element;

  return wrapElem.firstChild;
};

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
