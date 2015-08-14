import * as constants from '../constants';
import TodoAPI from '../api/todos';


export function fetchTodos(id) {
  return dispatch => {
    TodoAPI.fetchTodos(id)
             .then(res => dispatch({
               type: constants.RECEIVE_TODOS,
               todos: res,
             }));
  };
}

export function fetchTodo(id) {
  return dispatch => {
    TodoAPI.fetchTodo(id)
             .then(res => dispatch({
               type: constants.RECEIVE_TODOS,
               todos: [res],
             }));
  };
}
