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

    const TWO_MINUTES = 2 * 60 * 1000;
    if (lastTransaction && (Date.now() - new Date(lastTransaction.transactionDate).getTime() > TWO_MINUTES)) {
      if (account.status !== 'inactive') {
        console.log(`Account with number ${account.accountNumber} is inactive. Updating status...`);
        account.status = 'inactive';
        await account.save();
        console.log(`Account with number ${account.accountNumber} status updated to 'inactive'.`);
      }
    } else {
      console.log(`Account with number ${account.accountNumber} is active.`);
    }
  }

  console.log('Finished checking for inactive accounts.');
}

export default deactivateInactiveAccounts;
