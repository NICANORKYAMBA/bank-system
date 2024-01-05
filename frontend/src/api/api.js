import axios from 'axios';

export const fetchAccounts = async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/accounts/user/${userId}`, {
    params: {
      limit: 10,
      offset: 0,
      sort: 'createdAt',
      order: 'DESC'
    }
  });
  return response.data.accounts;
};

export const fetchTransactions = async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/transactions/user/${userId}`, {
    params: {
      limit: 10,
      offset: 0,
      sort: 'createdAt',
      order: 'DESC'
    }
  });
  return response.data.transactions;
};

export const fetchAccount = async (accountId) => {
  const response = await axios.get(`http://localhost:5000/api/accounts/id/${accountId}`);
  return response.data;
};
