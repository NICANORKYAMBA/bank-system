import { applyInterest } from '../controllers/accountsController.js';
import Account from '../models/accounts.js';

async function applyInterestToAllAccounts() {
  const savingsAccounts = await Account.findAll({ where: { accountType: 'savings' } });

  for (let account of savingsAccounts) {
    try {
      await applyInterest(account.accountNumber);
    } catch (err) {
      console.error(`Failed to apply interest to account ${account.accountNumber}: ${err.message}`);
    }
  }
}

export default applyInterestToAllAccounts;