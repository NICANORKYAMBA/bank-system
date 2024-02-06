import {
  SET_USER_DATA,
  SET_USER_ADDRESS,
  SET_USER_ACCOUNTS_DATA,
  SET_USER_SELECTED_ACCOUNT_ID,
  SET_USER_SELECTED_ACCOUNT,
  SET_USER_TRANSACTIONS,
  SET_LOADING,
  SET_ERROR,
  RESET_USER_STATE,
  LOGOUT
} from '../actions/userActions';

const initialState = {
  userData: null,
  userAccountsData: [],
  selectedAccountId: null,
  userSelectedAccount: null,
  userTransactions: [],
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    case SET_USER_ADDRESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          userAddress: action.payload
        }
      };
    case SET_USER_ACCOUNTS_DATA:
      return {
        ...state,
        userAccountsData: action.payload
      };
    case SET_USER_SELECTED_ACCOUNT_ID:
      return {
        ...state,
        selectedAccountId: action.payload
      };
    case SET_USER_SELECTED_ACCOUNT:
      return {
        ...state,
        userSelectedAccount: action.payload
      };
    case SET_USER_TRANSACTIONS:
      return {
        ...state,
        userTransactions: action.payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case RESET_USER_STATE:
      return initialState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
