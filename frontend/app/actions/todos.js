import * as constants from '../constants';
import TodoAPI from '../api/todos';


export function requestTodos() {
  return {
    type: constants.REQUEST_TODOS,
  };
}

export function receiveTodos(todos) {
  return {
    type: constants.RECEIVE_TODOS,
    todos,
  };
}

export function fetchTodos() {
  return function(dispatch) {
    dispatch(requestTodos());

    TodoAPI
      .fetchTodos()
      .then(json =>
        dispatch(receiveTodos(json))
      );
  };
}
