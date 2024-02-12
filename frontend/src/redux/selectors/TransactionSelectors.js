export const selectFilteredTransactions = (
  state,
  filterFromAccount,
  filterToAccount,
  filterTransactionType) => {
  if (!state.transaction.data) {
    return [];
  }

  const { allTransactions } = state.transaction.data;

  return allTransactions
    ? allTransactions.filter(transaction => (!filterFromAccount || (transaction.sourceTransactionAccount &&
      transaction.sourceTransactionAccount.accountNumber &&
      transaction.sourceTransactionAccount.accountNumber.startsWith(filterFromAccount))) &&
      (!filterToAccount || (transaction.destinationTransactionAccount &&
        transaction.destinationTransactionAccount.accountNumber &&
        transaction.destinationTransactionAccount.accountNumber.startsWith(filterToAccount))) &&
      (!filterTransactionType || transaction.type === filterTransactionType)) : [];
};
