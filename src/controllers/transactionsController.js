const Transaction = require('../models/transactions');
const Account = require('../models/accounts');
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const logger = require('./logger');

const handleErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

exports.createTransaction = async (req, res) => {
  handleErrors(req, res);
  const { type, amount, sourceAccountId, destinationAccountId, userId, description } = req.body;
  try {
    let sourceAccount = await Account.findByPk(sourceAccountId);
    if (!sourceAccount) {
      return res.status(404).json({
        message: `Source account with ID ${sourceAccountId} not found`
      });
    }

    if (sourceAccount.status !== 'active') {
      return res.status(400).json({
        message: 'Source account is not active'
      });
    }

    if (type === 'withdrawal' || type === 'transfer') {
      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          message: 'Insufficient balance'
        });
      }
      sourceAccount.balance = (Number(sourceAccount.balance) - amount).toFixed(2);
      await sourceAccount.save();
      sourceAccount = await Account.findByPk(sourceAccountId);
    }

    if (type === 'deposit') {
      sourceAccount.balance = (Number(sourceAccount.balance) + amount).toFixed(2);
      await sourceAccount.save();
      sourceAccount = await Account.findByPk(sourceAccountId);
    }

    let destinationAccount;
    if (type === 'transfer') {
      destinationAccount = await Account.findByPk(destinationAccountId);
      if (!destinationAccount) {
        return res.status(404).json({
          message: `Destination account with ID ${destinationAccountId} not found`
        });
      }
      if (destinationAccount.status !== 'active') {
        return res.status(400).json({
          message: 'Destination account is not active'
        });
      }
      destinationAccount.balance = (Number(destinationAccount.balance) + amount).toFixed(2);
      await destinationAccount.save();
    }

    const transaction = {
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

    await Transaction.create(transaction);

    let message = `A ${type} transaction of ${amount} ${sourceAccount.currency} was made on account ${sourceAccount.accountNumber}.`;
    if (type === 'transfer') {
      message += ` The amount was transferred to account ${destinationAccount.accountNumber}.`;
    }
    message += ` The balance after the transaction is ${sourceAccount.balance} ${sourceAccount.currency}.`;

    res.status(201).json({
      transaction,
      balanceAfterTransaction: sourceAccount.balance,
      message
    });
  } catch (err) {
    logger.error(`Server error while trying to create transaction: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to create transaction',
      message: err.message
    });
  }
};

exports.getAllTransactions = async (req, res) => {
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
      ]
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
    logger.error(`Server error while trying to fetch transactions: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch transactions',
      message: err.message
    });
  }
};

exports.getTransactionById = async (req, res) => {
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
    logger.error(`Server error while trying to fetch transaction with ID ${id}: ${err}`);
    res.status(500).json({
      error: `Server error while trying to fetch transaction with ID ${id}`,
      message: err.message
    });
  }
};

exports.getTransactionsByAccountNumber = async (req, res) => {
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
      ]
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
    logger.error(`Server error while trying to fetch transactions for account with account number ${accountNumber}: ${err}`);
    res.status(500).json({
      error: `Server error while trying to fetch transactions for account with account number ${accountNumber}`,
      message: err.message
    });
  }
};
