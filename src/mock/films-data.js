import {getRandomNumber, getRandomArrayElement} from './../util';
import {getComments} from './comments';
import {shuffleArray} from "./../util";

const countries = [`USA`, `Russia`, `France`];
const actors = [
  `Lee Aaker`,
  `Willie Aames`,
  `Quinton Aaron`,
  `Victor Aaron`,
  `Abbott and Costello`,
  `Bruce Abbott`,
  `Bud Abbott`,
  `Christopher Abbott`,
  `Philip Abbott`,
  `Richard Abbott`,
  `Jake Abel`,
  `Walter Abel`
];

const genres = [`Action`, `Adventure`, `Comedy`, `Crime`, `Drama`, `Horror`];
const films = [
  `Green Mile`,
  `Forrest Gump`,
  `Schindler's list`,
  `1+1`,
  `Beginning`,
  `Leon`,
  `Lion king`,
  `Fight club`,
  `Life is Beautiful`,
  `Knockin 'on Heaven`,
  `Godfather`,
  `Pulp Fiction`,
  `The Prestige`,
  `A Beautiful Mind`
];

const filmsPosters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const templateString = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const splittedString = templateString.split(`. `);

const getRandomElNumberFromArr = (arr, number) => shuffleArray(arr).slice(0, 1 + getRandomNumber(number - 1));

const getFilmTemplate = () => {
  const description = [...Array(1 + getRandomNumber(2, 0))]
    .map(() => getRandomArrayElement(splittedString))
    .join(`. `);

  const filmMark = getRandomNumber(90) / 10;

  const releaseDate = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10000))
  );

  const runTime = getRandomNumber(120, 60);

  return {
    name: getRandomArrayElement(films),
    filmMark,
    director: getRandomArrayElement(actors),
    writers: new Set(getRandomElNumberFromArr(actors, 3)),
    actors: new Set(getRandomElNumberFromArr(actors, 3)),
    releaseDate,
    country: getRandomArrayElement(countries),
    genres: new Set(getRandomElNumberFromArr(genres, 3)),
    description,
    poster: getRandomArrayElement(filmsPosters),
    runTime,
    isFavorite: Math.random() > 0.5,
    isInWatchList: Math.random() > 0.5,
    isInHistory: Math.random() > 0.5,
    comments: getComments()
  };
};

const getFilmsTemplate = (count) => [...Array(count)].map(getFilmTemplate);

export {getFilmsTemplate};
