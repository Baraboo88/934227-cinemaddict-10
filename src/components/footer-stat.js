export const addFooterStat = (number) => {
  return `<section class="footer__statistics">
    <p>${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `)} movies inside</p>
  </section>`;
};
