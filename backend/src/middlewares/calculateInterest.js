import sequelize from '../database.js';
import Account from '../models/accounts.js';

const INTEREST_RATE = 0.05;

async function applyInterestToAccount (accountNumber) {
  const account = await Account.findOne({ where: { accountNumber } });
  if (!account) {
    throw new Error(`Account with number ${accountNumber} not found`);
  }

  if (account.status !== 'active') {
    console.log(`Account with number ${accountNumber} is not active. Skipping interest application.`);
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const [updatedRows] = await Account.update(
      { balance: sequelize.literal(`balance * ${1 + INTEREST_RATE}`) },
      { where: { accountNumber } },
      { transaction }
    );

    if (updatedRows > 0) {
      await transaction.commit();
      console.log(`Interest applied to account with number ${accountNumber}`);
    } else {
      throw new Error('Interest not applied');
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function applyInterestToAllAccounts () {
  const savingsAccounts = await Account.findAll({ where: { accountType: 'savings' } });

  for (const account of savingsAccounts) {
    try {
      await applyInterestToAccount(account.accountNumber);
    } catch (err) {
      console.error(`Failed to apply interest to account ${account.accountNumber}: ${err.message}`);
    }
  }
}

export default applyInterestToAllAccounts;
