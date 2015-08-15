import { combineReducers } from 'redux';

import * as data from './data';
import * as ui from './ui';


// Export the combination of all sub-reducers.
export default combineReducers({
  data: combineReducers(data),
  ui:   combineReducers(ui),
});
