import AbstractComponent from "./abstract-component";

export const MovieThreshold = {
  BUFF: 21,
  FAN: 10,
  NOVICE: 0
};

const addProfileBlock = (number) => {
  const getNickName = (num) => {
    if (num > MovieThreshold.BUFF) {
      return `Movie Buff`;
    } else if (num > MovieThreshold.FAN) {
      return `Fan`;
    } else if (num > MovieThreshold.NOVICE) {
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
