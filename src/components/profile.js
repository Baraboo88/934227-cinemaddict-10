import AbstractComponent from "./abstract-component";


const addProfileBlock = (number) => {
  const getNickName = (num) => {
    if (num > 21) {
      return `Movie Buff`;
    } else if (num > 10) {
      return `Fan`;
    } else if (num > 0) {
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
