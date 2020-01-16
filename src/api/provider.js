import Movie from "../models/movie";
import Comment from "../models/comment";
import {movieOfflineStatus} from "../utils/util";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSunchronized = true;
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies().then((movies) => {
        movies.forEach((movie) => {
          this._setStoreItem(movie.id, movie.toRaw());
        });
        return Promise.resolve(movies);
      });
    } else {

      const data = this._store.getAll();
      const items = Object.values(data).map((movie) => movie.data);
      return Promise.resolve(Movie.parseMovies(items));
    }
  }

  updateMovie(id, data) {
    if (this._isOnLine()) {
      return this._api.updateMovie(id, data);
    } else {
      this._setStoreItem(id, data, movieOfflineStatus.UPDATED);
      this._isSunchronized = false;
      return Promise.resolve(data);
    }
  }

  getComments(id) {
    if (this._isOnLine()) {
      return this._api.getComments(id).then((comments) => {
        const data = this._store.getAll();
        const storeMovie = Object.values(data).map((movieId) => movieId.data).find((dataItem) => dataItem.id === id);
        if (storeMovie) {
          storeMovie.comments = comments;
          this._setStoreItem(storeMovie.id, storeMovie);
        }
        return Promise.resolve(comments);
      });
    } else {
      const data = this._store.getAll();
      const storeMovie = Object.values(data).map((movieId) => movieId.data).find((dataItem) => dataItem.id === id);
      if (storeMovie) {
        return Promise.resolve(Comment.parseComments(storeMovie.comments));
      }
    }
    return Promise.resolve(Comment.parseComments([]));
  }

  _setStoreItem(key, data, state = movieOfflineStatus.INITIAL) {

    this._store.setItem(key, {
      state,
      data
    });
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

  sync() {
    const data = this._store.getAll();
    const items = Object.values(data).filter((dataItem) => {
      return dataItem.state === movieOfflineStatus.UPDATED;
    }).map((item) => {
      return item.data;
    });
    return this._api.sync(items).then((result) => {
      this._isSynchronized = true;
      if (result && result.updated) {
        const updatedMovies = Movie.parseMovies(result.updated);
        return Promise.resolve(updatedMovies);
      }
      return Promise.resolve([]);
    });
  }


  isSynchronized() {
    return this._isSunchronized;
  }
}
