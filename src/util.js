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

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
