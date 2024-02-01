import {
  SET_SELECTED_ACCOUNT,
  SET_LOADING,
  SET_ERROR,
  SET_SEARCH_CATEGORY,
  SET_SEARCH_TERM
} from '../actions/DashboardActions';

const initialState = {
  selectedAccount: null,
  loading: false,
  error: null,
  searchTerm: '',
  searchCategory: ''
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload
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
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    case SET_SEARCH_CATEGORY:
      return {
        ...state,
        searchCategory: action.payload
      };
    default:
      return state;
  }
};

export default dashboardReducer;
