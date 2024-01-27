import {
  SET_SELECTED_ACCOUNT,
  SET_SELECTED_ACCOUNT_DATA,
  SET_ACCOUNTS_DATA,
  SET_LOADING,
    SET_ERROR,
    SET_TRANSACTIONS,
  SET_SHOW_DEPOSIT_FORM,
  SET_SHOW_TRANSFER_FORM,
  SET_SHOW_WITHDRAWAL_FORM,
  SET_SEARCH_CATEGORY,
  SET_SEARCH_TERM
} from '../actions/DashboardActions';

const initialState = {
  selectedAccount: null,
  selectedAccountData: null,
  accountsData: [],
  loading: false,
  error: null,
    transactions: [],
  showTransferForm: false,
  showWithdrawalForm: false,
  showDepositForm: false,
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
    case SET_SELECTED_ACCOUNT_DATA:
      return {
        ...state,
        selectedAccountData: action.payload
      };
    case SET_ACCOUNTS_DATA:
      return {
        ...state,
        accountsData: action.payload
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
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    case SET_SHOW_TRANSFER_FORM:
      return {
        ...state,
        showTransferForm: action.payload
      };
    case SET_SHOW_WITHDRAWAL_FORM:
      return {
        ...state,
        showWithdrawalForm: action.payload
      };
    case SET_SHOW_DEPOSIT_FORM:
      return {
        ...state,
        showDepositForm: action.payload
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
