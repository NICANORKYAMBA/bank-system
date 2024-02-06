import {
  fetchAccounts,
  fetchTransactionsByAccountId,
  fetchAccount
} from '../../api/api';

export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_USER_ADDRESS = 'SET_USER_ADDRESS';
export const SET_USER_ACCOUNTS_DATA = 'SET_USER_ACCOUNTS_DATA';
export const SET_USER_SELECTED_ACCOUNT_ID = 'SET_USER_SELECTED_ACCOUNT_ID';
export const SET_USER_SELECTED_ACCOUNT = 'SET_USER_SELECTED_ACCOUNT';
export const SET_USER_TRANSACTIONS = 'SET_USER_TRANSACTIONS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const RESET_USER_STATE = 'RESET_USER_STATE';
export const LOGOUT = 'LOGOUT';

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData
});

export const setUserAddress = (userAddress) => ({
  type: SET_USER_ADDRESS,
  payload: userAddress
});

export const setUserAccountsData = (userAccountsData) => ({
  type: SET_USER_ACCOUNTS_DATA,
  payload: userAccountsData
});

export const setSelectedAccountId = (selectedAccountId) => ({
  type: SET_USER_SELECTED_ACCOUNT_ID,
  payload: selectedAccountId
});

export const setUserSelectedAccount = (userSelectedAccount) => ({
  type: SET_USER_SELECTED_ACCOUNT,
  payload: userSelectedAccount
});

export const setUserTransactions = (userTransactions) => ({
  type: SET_USER_TRANSACTIONS,
  payload: userTransactions
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

export const setError = (errorMessage) => ({
  type: SET_ERROR,
  payload: errorMessage
});

export const resetUserState = () => ({
  type: RESET_USER_STATE
});


export const logout = () => ({
  type: LOGOUT
});

export const fetchAllAccountsDataThunk = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const accountsData = await fetchAccounts(userId);
    dispatch(setUserAccountsData(accountsData));
  } catch (error) {
    dispatch(setError('Error fetching all accounts data'));
  }
  dispatch(setLoading(false));
};

export const fetchSelectedAccountDataThunk = (accountId) => async (dispatch) => {
  try {
    const selectedAccountData = await fetchAccount(accountId);
    dispatch(setUserSelectedAccount(selectedAccountData));

    const transactions = await fetchTransactionsByAccountId(accountId);
    dispatch(setUserTransactions(transactions));
  } catch (error) {
    dispatch(setError('Error fetching selected account data'));
  }
};
