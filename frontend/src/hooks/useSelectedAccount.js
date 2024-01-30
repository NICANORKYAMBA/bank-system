import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchSelectedAccountDataThunk
} from '../redux/actions/DashboardActions';

export const useSelectedAccount = (selectedAccount) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedAccount !== null) {
      dispatch(fetchSelectedAccountDataThunk(selectedAccount.id));
    }
  }, [selectedAccount, dispatch]);
};
