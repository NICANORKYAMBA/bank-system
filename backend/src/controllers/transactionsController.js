import { param, query, body, validationResult } from 'express-validator';
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

function buildTransactionMessage (
  type,
  amount,
  currency,
  sourceAccount,
  destinationAccount,
  balance) {
  let message = `A ${type} transaction of ${amount} 
  ${currency} was made on account ${sourceAccount.accountNumber}`;
  if (type === 'transfer') {
    message += ` The amount ${amount} was transferred to 
    ${destinationAccount.accountNumber}`;
  }
  message += ` The balance after the transaction is ${balance} ${currency}`;
  return message;
}

export const createTransaction = [
  body('type')
    .isIn(['deposit', 'withdrawal', 'transfer'])
    .withMessage('Must be one of: deposit, withdrawal, transfer'),
  body('amount')
    .isNumeric().withMessage('Must be a number'),
  body('sourceAccountNumber').isString()
    .withMessage('Must be a valid account number'),
  body('destinationAccountNumber').optional().isString()
    .withMessage('Must be a valid account number'),
  body('userId').isUUID()
    .withMessage('Must be a valid UUID'),
  body('description').optional().isString()
    .withMessage('Must be a string'),
  body('fee').optional().isNumeric()
    .withMessage('Fee must be a number'),
  body('exchangeRate').optional().isNumeric()
    .withMessage('Exchange rate must be a number'),
  body('transactionReference').optional().isString()
    .withMessage('Transaction reference must be a string'),
  body('channel').optional().isIn(['online', 'branch', 'ATM', 'mobile'])
    .withMessage('Channel must be one of: online, branch, ATM, mobile'),
  body('ipAddress').optional().isIP()
    .withMessage('IP address must be a valid IP address'),
  body('deviceInformation').optional().isString()
    .withMessage('Device information must be a string'),
  body('checkNumber').optional().isString()
    .withMessage('Check number must be a string'),
  body('attachmentUrl').optional().isURL()
    .withMessage('Attachment URL must be a valid URL'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      amount,
      sourceAccountNumber,
      destinationAccountNumber,
      userId,
      description,
      fee,
      exchangeRate,
      transactionReference,
      channel,
      ipAddress,
      deviceInformation,
      checkNumber,
      attachmentUrl
    } = req.body;

    if ((type === 'deposit' && amount < 10) ||
      (type !== 'deposit' && amount < 100)) {
      return handleValidationError(
        res, `The transaction amount for a ${type} must be at least 
        ${type === 'deposit' ? 10 : 100}`
      );
    }

    const transaction = await sequelize.transaction();
    try {
      let sourceAccount = await Account.findOne({
        where: {
          accountNumber: sourceAccountNumber
        }
      });
      if (!sourceAccount) {
        throw new Error(
          `Source account with number ${sourceAccountNumber} not found`);
      }

      if (sourceAccount.userId !== userId) {
        throw new Error(
          'The userId in the transaction does not match the userId of the source account');
      }

      if (sourceAccount.status !== 'active') {
        throw new Error('Source account is not active');
      }

      if (type === 'transfer') {
        if (sourceAccountNumber === destinationAccountNumber) {
          throw new Error('Transfer transaction cannot happen on the same account');
        }

        if (Number(sourceAccount.balance) < amount) {
          throw new Error('Insufficient balance');
        }

        sourceAccount = await updateAccountBalance(
          sourceAccount.id, -amount, transaction
        );
      }

      if (type === 'withdrawal') {
        if (Number(sourceAccount.balance) < amount) {
          throw new Error('Insufficient balance');
        }

        sourceAccount = await updateAccountBalance(
          sourceAccount.id, -amount, transaction
        );
      }

      if (type === 'deposit') {
        sourceAccount = await updateAccountBalance(
          sourceAccount.id, amount, transaction
        );
      }

      let destinationAccount;
      if (type === 'transfer') {
        destinationAccount = await Account.findOne({
          where: {
            accountNumber: destinationAccountNumber
          }
        });
        if (!destinationAccount) {
          throw new Error(
            `Destination account with number ${destinationAccountNumber} not found`);
        }

        if (destinationAccount.status !== 'active') {
          throw new Error('Destination account is not active');
        }

        destinationAccount = await updateAccountBalance(
          destinationAccount.id, amount, transaction
        );
      }

      const transactionData = {
        type,
        amount,
        fee,
        exchangeRate,
        transactionReference,
        channel,
        ipAddress,
        deviceInformation,
        checkNumber,
        attachmentUrl,
        balance: sourceAccount.balance,
        currency: sourceAccount.currency,
        status: 'completed',
        sourceAccount: sourceAccount.accountNumber,
        destinationAccount: destinationAccount
          ? destinationAccount.accountNumber
          : sourceAccount.accountNumber,
        userId,
        accountId: sourceAccount.id,
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount
          ? destinationAccount.id
          : sourceAccount.id,
        description
      };

      const newTransaction = await Transaction.create(
        transactionData, { transaction });

      await transaction.commit();

      const message = buildTransactionMessage(
        type,
        amount,
        sourceAccount.currency,
        sourceAccount,
        destinationAccount,
        sourceAccount.balance
      );

      const sourceAccountAfter = await Account.findByPk(sourceAccount.id);
      let destinationAccountAfter;
      if (type === 'transfer') {
        destinationAccountAfter = await Account.findByPk(destinationAccount.id);
      }

      res.status(201).json({
        transaction: {
          id: newTransaction.id,
          ...transactionData
        },
        sourceAccountBalanceAfter: sourceAccountAfter.balance,
        destinationAccountBalanceAfter: destinationAccountAfter
          ? destinationAccountAfter.balance
          : null,
        message
      });
      const user = await User.findByPk(userId);
      const phoneNumber = user.phoneNumber;
      const deviceToken = user.deviceToken;

      const notificationMessage = buildTransactionMessage(
        type,
        amount,
        sourceAccount.currency,
        sourceAccount,
        destinationAccount,
        sourceAccount.balance
      );

      await sendSMS(phoneNumber, notificationMessage);

      await sendPushNotification(
        deviceToken,
        'New Transaction',
        notificationMessage
      );
    } catch (err) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }
      next(err);
    }
  }
];

export const getAllTransactions = [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  query('type').optional().isIn(['deposit', 'withdrawal', 'transfer']).withMessage('Type must be one of: deposit, withdrawal, transfer'),
  query('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Status must be one of: pending, completed, failed'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit, offset, sort, order, type, status } = req.query;
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
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          },
          {
            model: Account,
            as: 'destinationTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          }
        ],
        attributes: [
          'id',
          'type',
          'amount',
          'fee',
          'exchangeRate',
          'transactionReference',
          'channel',
          'ipAddress',
          'deviceInformation',
          'checkNumber',
          'attachmentUrl',
          'description',
          'createdAt',
          'updatedAt'
        ],
        limit,
        offset,
        order: sort ? [[sort, order]] : undefined
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
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      next(err);
    }
  }
];

export const getTransactionById = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: Account,
            as: 'sourceTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          },
          {
            model: Account,
            as: 'destinationTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
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
  }
];

export const getTransactionsByAccountNumber = [
  param('accountNumber').isString().withMessage('Account number must be a string'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  query('type').optional().isIn(['deposit', 'withdrawal', 'transfer']).withMessage('Type must be one of: deposit, withdrawal, transfer'),
  query('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Status must be one of: pending, completed, failed'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    const { limit, offset, sort, order } = req.query;

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
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          },
          {
            model: Account,
            as: 'destinationTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          }
        ],
        limit,
        offset,
        order: [[sort, order]]
      });

      if (transactions.length > 0) {
        const message = transactions.length === 1 ? 'transaction' : 'transactions';
        res.status(200).json({
          message: `${transactions.length} ${message} found`,
          transactions
        });
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
  }
];

export const getTransactionsByUserId = [
  param('userId').isUUID().withMessage('User ID must be a valid UUID'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  query('type').optional().isIn(['deposit', 'withdrawal', 'transfer']).withMessage('Type must be one of: deposit, withdrawal, transfer'),
  query('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Status must be one of: pending, completed, failed'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { limit, offset, sort, order } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`
      });
    }

    try {
      const transactions = await Transaction.findAll({
        where: {
          userId
        },
        include: [
          {
            model: Account,
            as: 'sourceTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          },
          {
            model: Account,
            as: 'destinationTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          }
        ],
        limit,
        offset,
        order: sort && order ? [[sort, order]] : undefined
      });

      if (transactions.length > 0) {
        res.status(200).json({
          message: `${transactions.length} transactions found`,
          transactions
        });
      } else {
        res.status(200).json({
          message: 'No transactions found for this user',
          transactions: []
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
  }
];

export const getTransactionsByAccountId = [
  param('accountId').isUUID().withMessage('Account ID must be a valid UUID'),

  query('limit').optional().isInt({ min: 1 })
    .withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 })
    .withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id'])
    .withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC'])
    .withMessage('Order must be one of: ASC, DESC'),
  query('type').optional().isIn(['deposit', 'withdrawal', 'transfer'])
    .withMessage('Type must be one of: deposit, withdrawal, transfer'),
  query('status').optional().isIn(['pending', 'completed', 'failed'])
    .withMessage('Status must be one of: pending, completed, failed'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountId } = req.params;
    const { limit, offset, sort, order } = req.query;

    try {
      const account = await Account.findByPk(accountId);
      if (!account) {
        return res.status(200).json({
          message: `Account with ID ${accountId} not found`,
          transactions: []
        });
      }

      const transactions = await Transaction.findAll({
        where: { accountId },
        include: [
          {
            model: Account,
            as: 'sourceTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          },
          {
            model: Account,
            as: 'destinationTransactionAccount',
            attributes: [
              'accountNumber',
              'name',
              'balance',
              'currency',
              'userId',
              'status'
            ]
          }
        ],
        limit,
        offset,
        order: sort && order ? [[sort, order]] : undefined
      });

      const message = transactions.length === 0
        ? 'No transactions found'
        : `${transactions.length} transaction(s) found`;
      res.status(200).json({
        message,
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
  }
];

export const deleteTransaction = [
  param('id').isUUID().withMessage('Transaction ID must be a valid UUID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];

export const deleteTransactionsByAccountId = [
  param('accountId').isUUID().withMessage('Account ID must be a valid UUID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountId } = req.params;

    try {
      const account = await Account.findByPk(accountId);

      if (!account) {
        return res.status(404).json({
          message: `Account with ID ${accountId} not found`
        });
      }

      const deletedTransactions = await Transaction.destroy({
        where: { accountId }
      });

      if (deletedTransactions === 0) {
        return res.status(404).json({
          message: `No transactions found for account with ID ${accountId}`
        });
      }

      res.status(200).json({
        message: `Deleted ${deletedTransactions} transactions for account with ID 
        ${accountId}`
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
  }
];

export const deleteTransactionsByAccountNumber = [
  param('accountNumber').isString()
    .withMessage('Account number must be a valid string'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
        message: `Deleted ${deletedTransactions} transactions for account 
        with number ${accountNumber}`
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
  }
];

export const deleteTransactionsByUserId = [
  param('userId').isUUID().withMessage('User ID must be a valid UUID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          message: `User with ID ${userId} not found`
        });
      }

      const deletedTransactions = await Transaction.destroy({
        where: { userId }
      });

      if (deletedTransactions === 0) {
        return res.status(404).json({
          message: `No transactions found for user with ID ${userId}`
        });
      }

      res.status(200).json({
        message: `Deleted ${deletedTransactions} transactions for user with ID 
        ${userId}`
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
  }
];

export const reverseTransaction = [
  param('id').isUUID().withMessage('Transaction ID must be a valid UUID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

      if (originalTransaction.type === 'deposit' ||
        originalTransaction.type === 'withdrawal') {
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

      await updateAccountBalance(
        originalTransaction.destinationAccountId,
        reverseType === 'deposit'
          ? originalTransaction.amount
          : -originalTransaction.amount,
        transaction);

      if (reverseType === 'transfer') {
        await updateAccountBalance(
          originalTransaction.sourceAccountId,
          originalTransaction.amount,
          transaction);
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

      const sourceAccountAfter = await Account.findByPk(
        originalTransaction.destinationAccountId);
      let destinationAccountAfter;
      if (reverseType === 'transfer') {
        destinationAccountAfter = await Account.findByPk(
          originalTransaction.sourceAccountId);
      }

      res.status(201).json({
        message: `Transaction ${id} reversed`,
        transaction: reverseTransactionData,
        sourceAccountBalanceAfter: sourceAccountAfter.balance,
        destinationAccountBalanceAfter: destinationAccountAfter
          ? destinationAccountAfter.balance
          : null
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }
];

export const getAccountStatement = [
  param('accountNumber').isString()
    .withMessage('Account number must be a valid string'),
  query('startDate').isISO8601()
    .withMessage('startDate must be in ISO 8601 format (YYYY-MM-DD)'),
  query('endDate').isISO8601()
    .withMessage('endDate must be in ISO 8601 format (YYYY-MM-DD)'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    const { startDate, endDate } = req.query;

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
  }
];
