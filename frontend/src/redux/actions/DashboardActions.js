import {
  fetchAccounts,
  fetchTransactionsByAccountId,
  fetchAccount
} from '../../api/api';
// Action Types
export const SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT';
export const SET_SELECTED_ACCOUNT_DATA = 'SET_SELECTED_ACCOUNT_DATA';
export const SET_ACCOUNTS_DATA = 'SET_ACCOUNTS_DATA';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_SHOW_TRANSFER_FORM = 'SET_SHOW_TRANSFER_FORM';
export const SET_SHOW_WITHDRAWAL_FORM = 'SET_SHOW_WITHDRAWAL_FORM';
export const SET_SHOW_DEPOSIT_FORM = 'SET_SHOW_DEPOSIT_FORM';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SEARCH_CATEGORY = 'SET_SEARCH_CATEGORY';

// Action Creators
export const setSelectedAccount = (account) => ({
  type: SET_SELECTED_ACCOUNT,
  payload: account
});

export const setSelectedAccountData = (accountData) => ({
  type: SET_SELECTED_ACCOUNT_DATA,
  payload: accountData
});

export const setAccountsData = (accountsData) => ({
  type: SET_ACCOUNTS_DATA,
  payload: accountsData
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

export const setTransactions = (transactions) => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});

export const setShowTransferForm = (showTransferForm) => ({
  type: SET_SHOW_TRANSFER_FORM,
  payload: showTransferForm
});

export const setShowWithdrawalForm = (showWithdrawalForm) => ({
  type: SET_SHOW_WITHDRAWAL_FORM,
  payload: showWithdrawalForm
});

export const setShowDepositForm = (showDepositForm) => ({
  type: SET_SHOW_DEPOSIT_FORM,
  payload: showDepositForm
});

export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM,
  payload: searchTerm
});

export const setSearchCategory = (searchCategory) => ({
  type: SET_SEARCH_CATEGORY,
  payload: searchCategory
});

// Thunk Actions
export const fetchAllAccountsDataThunk = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const accountsData = await fetchAccounts(userId);
    dispatch(setAccountsData(accountsData));
  } catch (error) {
    console.error(error);
    dispatch(setError('Error fetching all accounts data'));
  }
  dispatch(setLoading(false));
};

export const fetchSelectedAccountDataThunk = (selectedAccountId) => async (dispatch) => {
 if (selectedAccountId) {
    dispatch(setLoading(true));
    try {
       const accountData = await fetchAccount(selectedAccountId);
      dispatch(setSelectedAccountData(accountData));
       
      const transactionsData = await fetchTransactionsByAccountId(selectedAccountId);
      dispatch(setTransactions(transactionsData));

      return accountData;
    } catch (error) {
      console.error(error);
      dispatch(setError('Error fetching data for selected account'));
    }
    dispatch(setLoading(false));
 }
};

export const handleTransactionCreatedThunk = (selectedAccountId) => async (dispatch) => {
  try {
    const transactionsData = await fetchTransactionsByAccountId(selectedAccountId);
    dispatch(setTransactions(transactionsData));

    const accountData = await fetchAccount(selectedAccountId);
    dispatch(setSelectedAccountData(accountData));

    dispatch(fetchAllAccountsDataThunk());
  } catch (error) {
    console.error(error);
    dispatch(setError('Error fetching data after transaction'));
  }

  dispatch(setShowTransferForm(false));
  dispatch(setShowWithdrawalForm(false));
  dispatch(setShowDepositForm(false));
};
