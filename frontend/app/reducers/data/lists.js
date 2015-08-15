import * as constants from '../../constants';


const initialState = {};


const actionsMap = {
  [constants.RECEIVE_LISTS]: (state, action) => {
    let newState = state;

    for( let list of action.lists ) {
      newState[list.id] = list;
    }

    return newState;
  },
};


export default function listStore(state = initialState, action) {
  const reduceFunc = actionsMap[action.type];
  if( !reduceFunc ) return state;

  return Object.assign({}, state, reduceFunc(state, action));
}
