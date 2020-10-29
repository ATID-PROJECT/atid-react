import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { dialog } from './dialog.reducer';
import ThemeOptions from './ThemeOptions';

const rootReducer = combineReducers({
  ThemeOptions,
  authentication,
  users,
  alert,
  dialog
});

export default rootReducer;