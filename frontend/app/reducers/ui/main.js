import * as constants from '../../constants';


const initialState = {
  selectedList: null,
};


const actionsMap = {
  [constants.SELECT_LIST]: (state, action) => ({
	...state,
	selectedList: action.selected,
  }),
};


export default function listStore(state = initialState, action) {
  const reduceFunc = actionsMap[action.type];
  if( !reduceFunc ) return state;

  return Object.assign({}, state, reduceFunc(state, action));
}
