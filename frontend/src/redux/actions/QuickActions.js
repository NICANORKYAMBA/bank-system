export const SHOW_DEPOSIT_FORM = 'SHOW_DEPOSIT_FORM';
export const HIDE_DEPOSIT_FORM = 'HIDE_DEPOSIT_FORM';
export const SHOW_TRANSFER_FORM = 'SHOW_TRANSFER_FORM';
export const HIDE_TRANSFER_FORM = 'HIDE_TRANSFER_FORM';
export const SHOW_WITHDRAWAL_FORM = 'SHOW_WITHDRAWAL_FORM';
export const HIDE_WITHDRAWAL_FORM = 'HIDE_WITHDRAWAL_FORM';

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
