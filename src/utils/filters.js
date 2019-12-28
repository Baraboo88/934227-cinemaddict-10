const filtersNames = [
  `watchlist`,
  `history`,
  `favorites`
];

const getFiltersCount = (filter, films) => {
  switch (filter) {
    case `watchlist`:
      return films.filter((el) => el.isInWatchList).length;
    case `history`:
      return films.filter((el) => el.isInHistory).length;
    case `favorites`:
      return films.filter((el) => el.isFavorite).length;
    default: return 0;
  }
};

const generateFilters = (films) => {
  return filtersNames.map((el) => {
    return {
      title: el,
      count: getFiltersCount(el, films)
    };
  });
};

export {generateFilters};
