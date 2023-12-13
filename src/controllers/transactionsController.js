const Transaction = require('../models/transactions');
const Account = require('../models/accounts');
const sequelize = require('../database');
const Sequelize = require('sequelize');

const updateAccountBalance = async (accountId, amount) => {
  const account = await Account.findByPk(accountId);
  account.balance = (Number(account.balance) + amount).toFixed(2);
  await account.save();
  return account;
};

exports.createTransaction = async (req, res, next) => {
  const { type, amount, sourceAccountId, destinationAccountId, userId, description } = req.body;
  const transaction = await sequelize.transaction();
  try {
    let sourceAccount = await Account.findByPk(sourceAccountId);
    if (!sourceAccount) {
      throw new Error(`Source account with ID ${sourceAccountId} not found`);
    }

    if (sourceAccount.status !== 'active') {
      throw new Error('Source account is not active');
    }

    if (type === 'transfer' || type === 'withdrawal') {
      if (Number(sourceAccount.balance) < amount) {
        throw new Error('Insufficient balance');
      }
      sourceAccount = await updateAccountBalance(sourceAccountId, -amount);
    }

    if (type === 'deposit') {
      sourceAccount = await updateAccountBalance(sourceAccountId, amount);
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

      destinationAccount = await updateAccountBalance(destinationAccountId, amount);
    }

    const transactionData = {
      type,
      amount,
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

    await Transaction.create(transactionData, { transaction });

    await transaction.commit();

    let message = `A ${type} transaction of ${amount} ${sourceAccount.currency} was made on account ${sourceAccount.accountNumber}`;
    if (type === 'transfer') {
      message += ` The amount ${amount} was transferred to ${destinationAccount.accountNumber}`;
    }
    message += ` The balance after the transaction is ${sourceAccount.balance} ${sourceAccount.currency}`;

    res.status(201).json({
      transaction: transactionData,
      balanceAfterTransaction: sourceAccount.balance,
      message
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';

  try {
    const transactions = await Transaction.findAll({
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
      res.status(200).json({
        message: `${transactions.length} transactions found`,
        transactions
      });
    } else {
      res.status(404).json({ message: 'No transactions found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
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
      res.status(404).json({ message: `Transaction with ID ${id} not found` });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByAccountNumber = async (req, res, next) => {
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
      return res.status(400).json({ message: 'Account is not active' });
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
      res.status(200).json({
        message: `${transactions.length} transactions found`,
        transactions
      });
    } else {
      res.status(404).json({ message: 'No transactions found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByUserId = async (req, res, next) => {
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
      res.status(200).json({
        message: `${transactions.length} transactions found`,
        transactions
      });
    } else {
      res.status(404).json({ message: 'No transactions found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByAccountId = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const { accountId } = req.params;

  try {
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: `Account with ID ${accountId} not found` });
    }

    if (account.status !== 'active') {
      return res.status(400).json({ message: 'Account is not active' });
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
      res.status(200).json({
        message: `${transactions.length} transactions found`,
        transactions
      });
    } else {
      res.status(404).json({ message: 'No transactions found' });
    }
  } catch (err) {
    next(err);
  }
};
