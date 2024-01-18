import axios from 'axios';

export const fetchAccounts = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/accounts/user/${userId}`, {
      params: {
        limit: 10,
        offset: 0,
        sort: 'createdAt',
        order: 'DESC'
      }
    });
    return response.data.accounts;
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    throw error;
  }
};

export const fetchTransactions = async (userId, limit = 10, offset = 0, sort = 'createdAt', order = 'DESC') => {
  const response = await axios.get(`http://localhost:5000/api/transactions/user/${userId}`, {
    params: {
      limit,
      offset,
      sort,
      order
    }
  });
  return response.data.transactions;
};

export const fetchAccount = async (accountId) => {
  const response = await axios.get(`http://localhost:5000/api/accounts/id/${accountId}`);
  return response.data;
};

export const fetchTransactionsByAccountId = async (accountId, limit = 10, offset = 0, sort = 'createdAt', order = 'DESC') => {
  try {
    const response = await axios.get(`http://localhost:5000/api/transactions/account/${accountId}`, {
      params: {
        limit,
        offset,
        sort,
        order
      }
    });
    return response.data.transactions;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
};

export const fetchAccountsByStatus = async (userId, status, limit = 10, offset = 0, sort = 'createdAt', order = 'DESC') => {
  try {
    const response = await axios.get(`http://localhost:5000/api/accounts/user/${userId}/status/${status}`, {
      params: {
        limit,
        offset,
        sort,
        order
      }
    });
    return response.data.accounts;
  } catch (error) {
    console.error(`Failed to fetch ${status} accounts for user ${userId}:`, error);
    throw error;
  }
};

export const updateAccountsName = async (accountNumber, name) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/accounts/${accountNumber}`, {
      name
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update account name for account number ${accountNumber}:`, error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user profile for user ${userId}:`, error);
    throw error;
  }
};