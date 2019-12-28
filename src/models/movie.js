export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.name = data[`film_info`][`title`];
    this.alternativeName = data[`film_info`][`alternative_title`];
    this.filmMark = data[`film_info`][`total_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = new Set(data[`film_info`][`writers`]);
    this.actors = new Set(data[`film_info`][`actors`]);
    this.releaseDate = data[`film_info`][`release`][`date`] ? new Date(data[`film_info`][`release`][`date`]) : null;
    this.country = data[`film_info`][`release`][`release_country`];
    this.genres = new Set(data[`film_info`][`genre`]);
    this.description = data[`film_info`][`description`];
    this.poster = data[`film_info`][`poster`].split(`/`).slice(-1)[0];
    this.runTime = data[`film_info`][`runtime`] * 60 * 1000;
    this.userDetails = data[`user_details`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.isInWatchList = data[`user_details`][`watchlist`];
    this.isInHistory = data[`user_details`][`already_watched`];
    this.whatchedDate = this.isInHistory ? new Date(data[`user_details`][`watching_date`]) : null;
    this.personalRating = data[`user_details`][`personal_rating`];
    this.ageRating = data[`film_info`][`age_rating`];
  }

  toRaw() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.name,
        'alternative_title': this.alternativeName,
        'poster': `images/posters/${this.poster}`,
        "total_rating": this.filmMark,
        'age_rating': this.ageRating * 1,
        'director': this.director,
        'writers': [...this.writers],
        'actors': [...this.actors],
        'release': {
          'date': this.releaseDate.toISOString(),
          'release_country': this.country
        },
        'runtime': Math.floor(this.runTime / 60 / 1000),
        'genre': [...this.genres],
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.isInWatchList,
        'already_watched': this.isInHistory,
        'watching_date': this.whatchedDate ? this.whatchedDate.toISOString() : this.whatchedDate,
        'favorite': this.isFavorite
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(movie) {
    return new Movie(movie.toRaw());
  }
}
