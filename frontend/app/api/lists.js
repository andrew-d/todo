/*global fetch */
import { checkStatus } from './util';

export default {
  fetchLists() {
    return fetch(`/api/lists`)
           .then(checkStatus)
           .then(res => res.json());
  },
};
