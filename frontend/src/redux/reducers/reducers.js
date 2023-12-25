import {
  TOGGLE_DARK_MODE,
  SHOW_LOGIN,
  HIDE_LOGIN,
  SHOW_REGISTER,
  HIDE_REGISTER,
} from '../actions/actions';

const initialState = {
  isDarkMode: false,
  showLogin: false,
  showRegister: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case SHOW_LOGIN:
      return {
        ...state,
        showLogin: true,
      };
    case HIDE_LOGIN:
      return {
        ...state,
        showLogin: false,
      };
    case SHOW_REGISTER:
      return {
        ...state,
        showRegister: true,
      };
    case HIDE_REGISTER:
      return {
        ...state,
        showRegister: false,
      };
    default:
      return state;
  }
};

export default reducer;