/*global fetch */
import { checkStatus } from './util';

export default {
  fetchTodos() {
    return fetch(`/api/todos`)
           .then(checkStatus)
           .then(res => res.json());
  },
}
