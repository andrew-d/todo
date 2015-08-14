/*global fetch */
import { checkStatus } from './util';

export default {
  fetchTodos() {
    return fetch(`/api/todos`)
           .then(checkStatus)
           .then(res => res.json());
  },

  fetchTodo(id) {
    return fetch(`/api/todos/${id}`)
           .then(checkStatus)
           .then(res => res.json());
  },
}
