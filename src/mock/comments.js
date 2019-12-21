import {getRandomNumber, getRandomArrayElement, usersNames} from '../utils/util';

const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const emoji = [`puke.png`, `sleeping.png`, `angry.png`, `smile.png`, `trophy.png`];

const getDate = () => new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10)));

const getComment = () => {
  return {
    user: getRandomArrayElement(comments),
    comment: getRandomArrayElement(usersNames),
    date: getDate(),
    emoji: getRandomArrayElement(emoji)
  };
};

export const getComments = () => [...Array(getRandomNumber(30))].map((el, i) => ({...getComment(), id: i}));
