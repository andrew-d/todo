import * as constants from '../constants';


export function selectList(id) {
  return {
    type:     constants.SELECT_LIST,
    selected: id,
  };
}
