export const addProfileBlock = (number) => {
  const getNickName = (num) => {
    if (num > 150) {
      return `Movie Monster`;
    } else if (num > 100) {
      return `Movie Madness`;
    } else {
      return `Movie Buff`;
    }
  };

  return `<section class="header__profile profile">
    <p class="profile__rating">${getNickName(number)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
