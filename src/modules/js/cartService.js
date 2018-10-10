import url from 'js/api.js';
import fetch from 'js/fetch.js';


export default class {
  static add(id) {
    return fetch(url.addCart, {
      id,
      number: 1
    });
  }
}