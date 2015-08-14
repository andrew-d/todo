import * as constants from '../constants';


const initialState = {};


const actionsMap = {
  /* TODO */
};


export default function todoStore(state = initialState, action) {
  const reduceFunc = actionsMap[action.type];
  if( !reduceFunc ) return state;

  return Object.assign({}, state, reduceFunc(state, action));
}
