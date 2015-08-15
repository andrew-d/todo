import * as constants from '../../constants';


const initialState = {};


const actionsMap = {
  [constants.RECEIVE_TODOS]: (state, action) => {
	let newState = state;

	for( let todo of action.todos ) {
	  newState[todo.id] = todo;
	}

	return newState;
  },
};


export default function todoStore(state = initialState, action) {
  const reduceFunc = actionsMap[action.type];
  if( !reduceFunc ) return state;

  return Object.assign({}, state, reduceFunc(state, action));
}
