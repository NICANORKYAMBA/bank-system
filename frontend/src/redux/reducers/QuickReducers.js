import {
  SHOW_DEPOSIT_FORM,
  HIDE_DEPOSIT_FORM,
  SHOW_TRANSFER_FORM,
  HIDE_TRANSFER_FORM,
  SHOW_WITHDRAWAL_FORM,
  HIDE_WITHDRAWAL_FORM
} from '../actions/QuickActions';

const initialState = {
  showDepositForm: false,
  showTransferForm: false,
  showWithdrawalForm: false
};

export default function formReducer (state = initialState, action) {
  switch (action.type) {
    case SHOW_DEPOSIT_FORM:
      return { ...state, showDepositForm: true };
    case HIDE_DEPOSIT_FORM:
      return { ...state, showDepositForm: false };
    case SHOW_TRANSFER_FORM:
      return { ...state, showTransferForm: true };
    case HIDE_TRANSFER_FORM:
      return { ...state, showTransferForm: false };
    case SHOW_WITHDRAWAL_FORM:
      return { ...state, showWithdrawalForm: true };
    case HIDE_WITHDRAWAL_FORM:
      return { ...state, showWithdrawalForm: false };
    default:
      return state;
  }
}
