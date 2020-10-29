import { alertConstants } from '../_constants';

const defaultState = {
  notifications: [],
};

export function alert(state = defaultState, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case alertConstants.CLEAR:
      return {};

    case alertConstants.ENQUEUE:
      return {
          ...state,
          notifications: [
              ...state.notifications,
              {
                  ...action.notification,
              },
          ],
      };

    case alertConstants.REMOVE:
      return {
          ...state,
          notifications: state.notifications.filter(
              notification => notification.key !== action.key,
          ),
      };
      
    default:
      return state
  }
}