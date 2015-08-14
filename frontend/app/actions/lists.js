import * as constants from '../constants';
import ListAPI from '../api/lists';


export function requestLists() {
  return {
    type: constants.REQUEST_LISTS,
  };
}

export function receiveLists(lists) {
  return {
    type: constants.RECEIVE_LISTS,
    lists,
  };
}

export function fetchLists() {
  return function(dispatch) {
    dispatch(requestLists());

    ListAPI
      .fetchLists()
      .then(json =>
        dispatch(receiveLists(json))
      );
  };
}
