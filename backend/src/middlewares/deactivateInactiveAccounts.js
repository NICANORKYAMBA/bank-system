import Transaction from '../models/transactions.js';
import Account from '../models/accounts.js';

async function deactivateInactiveAccounts () {
  console.log('Starting to check for inactive accounts...');
  const accounts = await Account.findAll();

  for (const account of accounts) {
    console.log(`Checking account with number ${account.accountNumber}...`);
    const lastTransaction = await Transaction.findOne({
      where: {
        accountId: account.id,
        status: 'completed'
      },
      order: [['transactionDate', 'DESC']]
    });

    console.log(lastTransaction);

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (lastTransaction && (Date.now() - new Date(lastTransaction.transactionDate).getTime() > TWENTY_FOUR_HOURS)) {
      if (account.status !== 'inactive') {
        console.log(`Account with number ${account.accountNumber} is inactive. Updating status...`);
        account.status = 'inactive';
        await account.save();
        console.log(`Account with number ${account.accountNumber} status updated to 'inactive'.`);
      }
    } else if (!lastTransaction && account.status !== 'inactive') {
      console.log(`Account with number ${account.accountNumber} has no transactions. Updating status to 'inactive'...`);
      account.status = 'inactive';
      await account.save();
      console.log(`Account with number ${account.accountNumber} status updated to 'inactive'.`);
    } else {
      console.log(`Account with number ${account.accountNumber} is active.`);
    }
  }

  console.log('Finished checking for inactive accounts.');
}

export default deactivateInactiveAccounts;