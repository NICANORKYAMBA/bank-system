import {
  fetchAccounts as fetchAccountsApi,
  fetchTransactions as fetchTransactionsApi
} from '../../api/api';

export const FETCH_TRANSACTIONS_REQUEST = 'FETCH_TRANSACTIONS_REQUEST';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_TRANSACTIONS_FAILURE = 'FETCH_TRANSACTIONS_FAILURE';

export const FETCH_ACCOUNTS_REQUEST = 'FETCH_ACCOUNTS_REQUEST';
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS';
export const FETCH_ACCOUNTS_FAILURE = 'FETCH_ACCOUNTS_FAILURE';

export const SET_FILTER_FROM_ACCOUNT = 'SET_FILTER_FROM_ACCOUNT';
export const SET_FILTER_TO_ACCOUNT = 'SET_FILTER_TO_ACCOUNT';
export const SET_FILTER_TRANSACTION_TYPE = 'SET_FILTER_TRANSACTION_TYPE';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';

export const SHOW_DEPOSIT_FORM = 'SHOW_DEPOSIT_FORM';
export const SHOW_TRANSFER_FORM = 'SHOW_TRANSFER_FORM';
export const SHOW_WITHDRAWAL_FORM = 'SHOW_WITHDRAWAL_FORM';
export const HIDE_FORMS = 'HIDE_FORMS';

export const INCREMENT_TRANSACTION_COUNT = 'INCREMENT_TRANSACTION_COUNT';

export const fetchTransactionsRequest = () => ({
  type: FETCH_TRANSACTIONS_REQUEST
});

export const fetchTransactionsSuccess = (transactions) => ({
  type: FETCH_TRANSACTIONS_SUCCESS,
  payload: transactions
});

export const fetchTransactionsFailure = (error) => ({
  type: FETCH_TRANSACTIONS_FAILURE,
  payload: error
});

export const fetchAccountsRequest = () => ({
  type: FETCH_ACCOUNTS_REQUEST
});

export const fetchAccountsSuccess = (accounts) => ({
  type: FETCH_ACCOUNTS_SUCCESS,
  payload: accounts
});

export const fetchAccountsFailure = (error) => ({
  type: FETCH_ACCOUNTS_FAILURE,
  payload: error
});

export const setFilterFromAccount = (account) => ({
  type: SET_FILTER_FROM_ACCOUNT,
  payload: account
});

export const setFilterToAccount = (account) => ({
  type: SET_FILTER_TO_ACCOUNT,
  payload: account
});

export const setFilterTransactionType = (type) => ({
  type: SET_FILTER_TRANSACTION_TYPE,
  payload: type
});

export const clearFilters = () => ({
  type: CLEAR_FILTERS
});

export const showDepositForm = () => ({
  type: SHOW_DEPOSIT_FORM
});

export const showTransferForm = () => ({
  type: SHOW_TRANSFER_FORM
});

export const showWithdrawalForm = () => ({
  type: SHOW_WITHDRAWAL_FORM
});

export const hideForms = () => ({
  type: HIDE_FORMS
});

export const incrementTransactionCount = () => ({
  type: INCREMENT_TRANSACTION_COUNT
});

export const fetchTransactions = (userId, limit, offset, orderBy, order) => {
  return async (dispatch) => {
    dispatch(fetchTransactionsRequest());
    try {
      const data = await fetchTransactionsApi(userId, limit, offset, orderBy, order);
      dispatch(fetchTransactionsSuccess(data));
    } catch (error) {
      dispatch(fetchTransactionsFailure(error.message));
    }
  };
};

export const fetchAccounts = (userId) => {
  return async (dispatch) => {
    dispatch(fetchAccountsRequest());
    try {
      const accountsData = await fetchAccountsApi(userId);
      dispatch(fetchAccountsSuccess(accountsData));
    } catch (error) {
      dispatch(fetchAccountsFailure(error.message));
    }
  };
};
