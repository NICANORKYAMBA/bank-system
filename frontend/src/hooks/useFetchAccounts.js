import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllAccountsDataThunk } from '../redux/actions/DashboardActions';

export const useFetchAccounts = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAccountsDataThunk(userId));
    }
  }, [userId, dispatch]);
};