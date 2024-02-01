import {
  fetchAccounts
} from '../../api/api';

export const SHOW_DEPOSIT_FORM = 'SHOW_DEPOSIT_FORM';
export const HIDE_DEPOSIT_FORM = 'HIDE_DEPOSIT_FORM';
export const SHOW_TRANSFER_FORM = 'SHOW_TRANSFER_FORM';
export const HIDE_TRANSFER_FORM = 'HIDE_TRANSFER_FORM';
export const SHOW_WITHDRAWAL_FORM = 'SHOW_WITHDRAWAL_FORM';
export const HIDE_WITHDRAWAL_FORM = 'HIDE_WITHDRAWAL_FORM';
export const FETCH_ACCOUNTS_DATA = 'FETCH_ACCOUNTS_DATA';
export const SET_ACCOUNTS_DATA = 'SET_ACCOUNTS_DATA';
export const FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR';

export const showDepositForm = () => ({
  type: SHOW_DEPOSIT_FORM
});

export const hideDepositForm = () => ({
  type: HIDE_DEPOSIT_FORM
});

export const showTransferForm = () => ({
  type: SHOW_TRANSFER_FORM
});

export const hideTransferForm = () => ({
  type: HIDE_TRANSFER_FORM
});

export const showWithdrawalForm = () => ({
  type: SHOW_WITHDRAWAL_FORM
});

export const hideWithdrawalForm = () => ({
  type: HIDE_WITHDRAWAL_FORM
});

export const setAccountsData = (accountsData) => ({
  type: SET_ACCOUNTS_DATA,
  payload: accountsData
});

export const fetchAccountsError = (errorMessage) => ({
  type: FETCH_ACCOUNTS_ERROR,
  payload: errorMessage
});

export const fetchAllAccountsDataThunk = (userId) => async (dispatch) => {
  try {
    const accountsData = await fetchAccounts(userId);
    dispatch(setAccountsData(accountsData));
  } catch (error) {
    console.error(error);
    dispatch(fetchAccountsError('Error fetching all accounts data'));
  }
};
