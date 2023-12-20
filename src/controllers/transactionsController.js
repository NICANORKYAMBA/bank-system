import Transaction from '../models/transactions.js';
import Account from '../models/accounts.js';
import User from '../models/user.js';
import sequelize from '../database.js';
import Sequelize from 'sequelize';
// import { sendSMS, sendPushNotification } from '../notifications.js';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';

const updateAccountBalance = async (accountId, amount, transaction = null) => {
  const account = await Account.findByPk(accountId);

  if (!account) {
    throw new Error(`Account with ID ${accountId} not found`);
  }

  if (account.status !== 'active') {
    throw new Error('Account is not active');
  }

  account.balance = (Number(account.balance) + Number(amount)).toFixed(2);
  await account.save({ transaction });

  return account;
};

export const createTransaction = async (req, res, next) => {
  const { type, amount, sourceAccountId, destinationAccountId, userId, description } = req.body;

  if ((type === 'deposit' && amount < 10) || (type !== 'deposit' && amount < 100)) {
    return handleValidationError(
      res, `The transaction amount for a ${type} must be at least ${type === 'deposit' ? 10 : 100}`);
  }

  const transaction = await sequelize.transaction();
  try {
    let sourceAccount = await Account.findByPk(sourceAccountId);
    if (!sourceAccount) {
      throw new Error(`Source account with ID ${sourceAccountId} not found`);
    }

    if (sourceAccount.userId !== userId) {
      throw new Error('The userId in the transaction does not match the userId of the source account');
    }

    if (sourceAccount.status !== 'active') {
      throw new Error('Source account is not active');
    }

    if (type === 'transfer') {
      if (sourceAccountId === destinationAccountId) {
        throw new Error('Transfer transaction cannot happen on the same account');
      }

      if (Number(sourceAccount.balance) < amount) {
        throw new Error('Insufficient balance');
      }
      sourceAccount = await updateAccountBalance(sourceAccountId, -amount, transaction);
    }

    if (type === 'deposit') {
      sourceAccount = await updateAccountBalance(sourceAccountId, amount, transaction);
    }

    let destinationAccount;
    if (type === 'transfer') {
      destinationAccount = await Account.findByPk(destinationAccountId);
      if (!destinationAccount) {
        throw new Error(`Destination account with ID ${destinationAccountId} not found`);
      }

      if (destinationAccount.status !== 'active') {
        throw new Error('Destination account is not active');
      }

      destinationAccount = await updateAccountBalance(
        destinationAccountId, amount, transaction);
    }

    const transactionData = {
      type,
      amount,
      balance: sourceAccount.balance,
      currency: sourceAccount.currency,
      status: 'completed',
      sourceAccount: sourceAccount.accountNumber,
      destinationAccount: destinationAccount ? destinationAccount.accountNumber : sourceAccount.accountNumber,
      userId,
      accountId: sourceAccountId,
      sourceAccountId,
      destinationAccountId: destinationAccountId || sourceAccountId,
      description
    };

    const newTransaction = await Transaction.create(transactionData, { transaction });

    await transaction.commit();

    let message = `A ${type} transaction of ${amount} ${sourceAccount.currency} was made on account ${sourceAccount.accountNumber}`;
    if (type === 'transfer') {
      message += ` The amount ${amount} was transferred to ${destinationAccount.accountNumber}`;
    }
    message += ` The balance after the transaction is ${sourceAccount.balance} ${sourceAccount.currency}`;

    const sourceAccountAfter = await Account.findByPk(sourceAccountId);
    let destinationAccountAfter;
    if (type === 'transfer') {
      destinationAccountAfter = await Account.findByPk(destinationAccountId);
    }

    res.status(201).json({
      transaction: {
        id: newTransaction.id,
        ...transactionData
      },
      sourceAccountBalanceAfter: sourceAccountAfter.balance,
      destinationAccountBalanceAfter: destinationAccountAfter ? destinationAccountAfter.balance : null,
      message
    });
    const user = await User.findByPk(userId);
    const phoneNumber = user.phoneNumber;
    const deviceToken = user.deviceToken;

    const notificationMessage = `A ${type} transaction of ${amount} ${sourceAccount.currency} was made on account ${sourceAccount.accountNumber}`;

    await sendSMS(phoneNumber, notificationMessage);

    await sendPushNotification(deviceToken, 'New Transaction', notificationMessage);
  } catch (err) {
    if (transaction.finished !== 'commit') {
      await transaction.rollback();
    }
    next(err);
  }
};

export const getAllTransactions = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const type = req.query.type;
  const status = req.query.status;

  const whereClause = {};

  if (type) {
    whereClause.type = type;
  }
  if (status) {
    whereClause.status = status;
  }

  try {
    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        {
          model: Account,
          as: 'sourceTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        },
        {
          model: Account,
          as: 'destinationTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        }
      ],
      limit,
      offset,
      order: [[sort, order]]
    });

    if (transactions.length > 0) {
      if (transactions.length === 1) {
        res.status(200).json({
          message: `${transactions.length} transaction found`,
          transactions
        });
      } else {
        res.status(200).json({
          message: `${transactions.length} transactions found`,
          transactions
        });
      }
    } else {
      res.status(404).json({ message: 'No transactions found' });
    }
  } catch (err) {
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    next(err);
  }
};

export const getTransactionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Account,
          as: 'sourceTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        },
        {
          model: Account,
          as: 'destinationTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        }
      ]
    });

    if (transaction) {
      res.status(200).json({
        message: `Transaction with ID ${id} found`,
        transaction
      });
    } else {
      res.status(404).json({
        message: `Transaction with ID ${id} not found`
      });
    }
  } catch (err) {
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    next(err);
  }
};

export const getTransactionsByAccountNumber = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const { accountNumber } = req.params;

  try {
    const account = await Account.findOne({
      where: {
        accountNumber
      }
    });

    if (!account) {
      return res.status(404).json({
        message: `Account with account number ${accountNumber} not found`
      });
    }

    if (account.status !== 'active') {
      return res.status(400).json({
        message: 'Account is not active'
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        [Sequelize.Op.or]: [
          { sourceAccount: accountNumber },
          { destinationAccount: accountNumber }
        ]
      },
      include: [
        {
          model: Account,
          as: 'sourceTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        },
        {
          model: Account,
          as: 'destinationTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        }
      ],
      limit,
      offset,
      order: [[sort, order]]
    });

    if (transactions.length > 0) {
      if (transactions.length === 1) {
        res.status(200).json({
          message: `${transactions.length} transaction found`,
          transactions
        });
      } else {
        res.status(200).json({
          message: `${transactions.length} transactions found`,
          transactions
        });
      }
    } else {
      res.status(404).json({
        message: 'No transactions found'
      });
    }
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const getTransactionsByUserId = async (req, res, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const { userId } = req.params;

  try {
    const transactions = await Transaction.findAll({
      where: {
        userId
      },
      include: [
        {
          model: Account,
          as: 'sourceTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        },
        {
          model: Account,
          as: 'destinationTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        }
      ],
      limit,
      offset,
      order: [[sort, order]]
    });

    if (transactions.length > 0) {
      if (transactions.length === 1) {
        res.status(200).json({
          message: `${transactions.length} transaction found`,
          transactions
        });
      } else {
        res.status(200).json({
          message: `${transactions.length} transactions found`,
          transactions
        });
      }
    } else {
      res.status(404).json({
        message: 'No transactions found'
      });
    }
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const getTransactionsByAccountId = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const { accountId } = req.params;

  try {
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({
        message: `Account with ID ${accountId} not found`
      });
    }

    if (account.status !== 'active') {
      return res.status(400).json({
        message: 'Account is not active'
      });
    }

    const transactions = await Transaction.findAll({
      where: { accountId },
      include: [
        {
          model: Account,
          as: 'sourceTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        },
        {
          model: Account,
          as: 'destinationTransactionAccount',
          attributes: ['accountNumber', 'name', 'balance', 'currency']
        }
      ],
      limit,
      offset,
      order: [[sort, order]]
    });

    if (transactions.length > 0) {
      if (transactions.length === 1) {
        res.status(200).json({
          message: `${transactions.length} transaction found`,
          transactions
        });
      } else {
        res.status(200).json({
          message: `${transactions.length} transactions found`,
          transactions
        });
      }
    } else {
      res.status(404).json({
        message: 'No transactions found'
      });
    }
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({
        message: `Transaction with ID ${id} not found`
      });
    }

    await transaction.destroy();
    res.status(200).json({
      message: `Transaction with ID ${id} deleted`
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const deleteTransactionsByAccountId = async (req, res, next) => {
  const { accountId } = req.params;

  try {
    const account = await Account.findByPk(accountId);

    if (!account) {
      return res.status(404).json({
        message: `Account with ID ${accountId} not found`
      });
    }

    const deletedTransactions = await Transaction.destroy({ where: { accountId } });

    if (deletedTransactions === 0) {
      return res.status(404).json({
        message: `No transactions found for account with ID ${accountId}`
      });
    }

    res.status(200).json({
      message: `Deleted ${deletedTransactions} transactions for account with ID ${accountId}`
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const deleteTransactionsByAccountNumber = async (req, res, next) => {
  const { accountNumber } = req.params;

  try {
    const account = await Account.findOne({ where: { accountNumber } });

    if (!account) {
      return res.status(404).json({
        message: `Account with number ${accountNumber} not found`
      });
    }

    const deletedTransactions = await Transaction.destroy({
      where: {
        [Sequelize.Op.or]: [
          { sourceAccount: accountNumber },
          { destinationAccount: accountNumber }
        ]
      }
    });

    if (deletedTransactions === 0) {
      return res.status(404).json({
        message: `No transactions found for account with number ${accountNumber}`
      });
    }

    res.status(200).json({
      message: `Deleted ${deletedTransactions} transactions for account with number ${accountNumber}`
    });
  } catch (err) {
    console.error(err);

    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }

    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }

    next(err);
  }
};

export const deleteTransactionsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`
      });
    }

    const deletedTransactions = await Transaction.destroy({ where: { userId } });

    if (deletedTransactions === 0) {
      return res.status(404).json({
        message: `No transactions found for user with ID ${userId}`
      });
    }

    res.status(200).json({
      message: `Deleted ${deletedTransactions} transactions for user with ID ${userId}`
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};

export const reverseTransaction = async (req, res, next) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const originalTransaction = await Transaction.findByPk(id);

    if (!originalTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    if (originalTransaction.reversed) {
      throw new Error(`Transaction ${id} is already reversed`);
    }

    if (originalTransaction.type === 'deposit' || originalTransaction.type === 'withdrawal') {
      throw new Error(`Cannot reverse a ${originalTransaction.type} transaction`);
    }

    let reverseType;

    switch (originalTransaction.type) {
      case 'transfer':
        reverseType = 'transfer';
        break;
      default:
        throw new Error(`Invalid transaction type: ${originalTransaction.type}`);
    }

    await updateAccountBalance(originalTransaction.destinationAccountId, reverseType === 'deposit' ? originalTransaction.amount : -originalTransaction.amount, transaction);

    if (reverseType === 'transfer') {
      await updateAccountBalance(originalTransaction.sourceAccountId, originalTransaction.amount, transaction);
    }

    originalTransaction.reversed = true;
    await originalTransaction.save({ transaction });

    await transaction.commit();

    const reverseTransactionData = {
      type: reverseType,
      amount: originalTransaction.amount,
      currency: originalTransaction.currency,
      status: 'completed',
      sourceAccount: originalTransaction.destinationAccount,
      destinationAccount: originalTransaction.sourceAccount,
      userId: originalTransaction.userId,
      accountId: originalTransaction.destinationAccountId,
      sourceAccountId: originalTransaction.destinationAccountId,
      destinationAccountId: originalTransaction.sourceAccountId,
      description: `Reverse of transaction ${id}`
    };

    const sourceAccountAfter = await Account.findByPk(originalTransaction.destinationAccountId);
    let destinationAccountAfter;
    if (reverseType === 'transfer') {
      destinationAccountAfter = await Account.findByPk(originalTransaction.sourceAccountId);
    }

    res.status(201).json({
      message: `Transaction ${id} reversed`,
      transaction: reverseTransactionData,
      sourceAccountBalanceAfter: sourceAccountAfter.balance,
      destinationAccountBalanceAfter: destinationAccountAfter ? destinationAccountAfter.balance : null
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export const getAccountStatement = async (req, res, next) => {
  const { accountNumber } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return handleValidationError(res, 'startDate and endDate are required');
  }

  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return handleValidationError(res, 'Invalid startDate or endDate');
  }

  try {
    const account = await Account.findOne({ where: { accountNumber } });

    if (!account) {
      return res.status(404).json({
        message: `Account with account number ${accountNumber} not found`
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        accountId: account.id,
        createdAt: {
          [Sequelize.Op.between]: [
            new Date(startDate).toISOString(),
            new Date(endDate + 'T23:59:59.999Z').toISOString()
          ]
        }
      },
      order: [['createdAt', 'ASC']]
    });

    if (transactions.length === 0) {
      return res.status(404).json({
        message: 'No transactions found for this account in the given date range'
      });
    }

    const openingBalance = transactions[0].balance - transactions[0].amount;
    const closingBalance = transactions[transactions.length - 1].balance;

    res.status(200).json({
      openingBalance,
      closingBalance,
      transactions
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return handleValidationError(res, err.message);
    }
    if (err instanceof Sequelize.DatabaseError) {
      return handleDatabaseError(res, err);
    }
    next(err);
  }
};
