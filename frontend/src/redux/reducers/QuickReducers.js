import {
  SHOW_DEPOSIT_FORM,
  HIDE_DEPOSIT_FORM,
  SHOW_TRANSFER_FORM,
  HIDE_TRANSFER_FORM,
  SHOW_WITHDRAWAL_FORM,
  HIDE_WITHDRAWAL_FORM,
  SET_ACCOUNTS_DATA,
  FETCH_ACCOUNTS_ERROR
} from '../actions/QuickActions';

const initialState = {
  showDepositForm: false,
  showTransferForm: false,
  showWithdrawalForm: false,
  accountsData: [], // Add a new state property to store the accounts data
  fetchAccountsError: null // Add a new state property to store any error that occurs during fetching
};

export default function formReducer (state = initialState, action) {
  switch (action.type) {
    case SHOW_DEPOSIT_FORM:
      return { ...state, showDepositForm: true };
    case HIDE_DEPOSIT_FORM:
      return { ...state, showDepositForm: false };
    case SHOW_TRANSFER_FORM:
      return { ...state, showTransferForm: true };
    case HIDE_TRANSFER_FORM:
      return { ...state, showTransferForm: false };
    case SHOW_WITHDRAWAL_FORM:
      return { ...state, showWithdrawalForm: true };
    case HIDE_WITHDRAWAL_FORM:
      return { ...state, showWithdrawalForm: false };
    case SET_ACCOUNTS_DATA:
      return { ...state, accountsData: action.payload, fetchAccountsError: null }; // Handle setting the accounts data
    case FETCH_ACCOUNTS_ERROR:
      return { ...state, fetchAccountsError: action.payload }; // Handle setting the fetch error
    default:
      return state;
  }
}
