import {
  SET_USER_DATA,
  LOGOUT
} from '../actions/userActions';

const initialState = {
  userData: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
