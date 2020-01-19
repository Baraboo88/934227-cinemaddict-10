import AbstractComponent from "./abstract-component";

const MOVIE_BUFF_THRESHOLD = 21;
const MOVIE_FAN_THRESHOLD = 10;
const MOVIE_NOVICE_THRESHOLD = 0;

const addProfileBlock = (number) => {
  const getNickName = (num) => {
    if (num > MOVIE_BUFF_THRESHOLD) {
      return `Movie Buff`;
    } else if (num > MOVIE_FAN_THRESHOLD) {
      return `Fan`;
    } else if (num > MOVIE_NOVICE_THRESHOLD) {
      return `Novice`;
    } else {
      return ``;
    }
  };

  return `<section class="header__profile profile">
    <p class="profile__rating">${getNickName(number)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractComponent {
  constructor(number) {
    super();
    this._number = number;
  }

  getTemplate() {
    return addProfileBlock(this._number);
  }

}
