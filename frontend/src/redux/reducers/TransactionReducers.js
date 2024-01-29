import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILURE,
  SET_FILTER_FROM_ACCOUNT,
  SET_FILTER_TO_ACCOUNT,
  SET_FILTER_TRANSACTION_TYPE,
  CLEAR_FILTERS,
  SHOW_DEPOSIT_FORM,
  SHOW_TRANSFER_FORM,
  SHOW_WITHDRAWAL_FORM,
  HIDE_FORMS,
  INCREMENT_TRANSACTION_COUNT
} from '../actions/TransactionActions';

const initialState = {
  data: {
    allTransactions: [],
    accounts: []
  },
  loading: false,
  error: null,
  filterFromAccount: '',
  filterToAccount: '',
  filterTransactionType: '',
  showDepositForm: false,
  showTransferForm: false,
  showWithdrawalForm: false,
  transactionCount: 0
};

const TransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTIONS_REQUEST:
    case FETCH_ACCOUNTS_REQUEST:
      return { ...state, loading: true };

    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          allTransactions: action.payload
        },
        loading: false
      };

    case FETCH_ACCOUNTS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          accounts: action.payload
        },
        loading: false
      };

    case FETCH_TRANSACTIONS_FAILURE:
    case FETCH_ACCOUNTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_FILTER_FROM_ACCOUNT:
      return { ...state, filterFromAccount: action.payload };
    case SET_FILTER_TO_ACCOUNT:
      return { ...state, filterToAccount: action.payload };
    case SET_FILTER_TRANSACTION_TYPE:
      return { ...state, filterTransactionType: action.payload };

    case CLEAR_FILTERS:
      return {
        ...state,
        filterFromAccount: '',
        filterToAccount: '',
        filterTransactionType: ''
      };

    case SHOW_DEPOSIT_FORM:
    case SHOW_TRANSFER_FORM:
    case SHOW_WITHDRAWAL_FORM:
      return { ...state, [action.type]: true };

    case HIDE_FORMS:
      return {
        ...state,
        showDepositForm: false,
        showTransferForm: false,
        showWithdrawalForm: false
      };

    case INCREMENT_TRANSACTION_COUNT:
      return { ...state, transactionCount: state.transactionCount + 1 };

    default:
      return state;
  }
};

export default TransactionReducer;
