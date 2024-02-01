export const SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT';
export const SET_SELECTED_ACCOUNT_DATA = 'SET_SELECTED_ACCOUNT_DATA';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
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

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM,
  payload: searchTerm
});

export const setSearchCategory = (searchCategory) => ({
  type: SET_SEARCH_CATEGORY,
  payload: searchCategory
});
