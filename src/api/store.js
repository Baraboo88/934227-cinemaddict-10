export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {
    try {
      const store = this._storage.getItem(this._storeKey);
      if (store) {
        return JSON.parse(this._storage.getItem(this._storeKey));
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();
    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, {[key]: value})));
  }
}
