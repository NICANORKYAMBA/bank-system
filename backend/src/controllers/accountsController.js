import { param, body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import Account from '../models/accounts.js';
import User from '../models/user.js';
import { Sequelize } from 'sequelize';
import sequelize from '../database.js';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';
import logger from './logger.js';

const getAccount = async (accountNumber) => {
  return await Account.findOne({ where: { accountNumber } });
};

const generateUniqueAccountNumber = () => {
  const randomNumber = Math.floor(Math.random() * 9e14) + 1e14;
  const accountNumber = randomNumber.toString().padStart(15, '0');
  return accountNumber;
};

export const getAllAccounts = [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'DESC';

    try {
      const accounts = await Account.findAll({
        limit,
        offset,
        order: [[sort, order]]
      });
      if (accounts.length > 0) {
        res.status(200).json({
          message: `${accounts.length} accounts retrieved`,
          limit,
          offset,
          sort,
          order,
          accounts
        });
      } else {
        res.status(404).json({
          message: 'No accounts found',
          limit,
          offset,
          sort,
          order
        });
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(`Server error while trying to get all accounts: ${err}`);
      next(err);
    }
  }
];

export const getAccountById = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      const account = await Account.findByPk(id);
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({
          message: `Account with ID ${id} not found`
        });
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(`Server error while trying to get account by ID: ${err}`);
      next(err);
    }
  }
];

export const getAccountByNumber = [
  param('accountNumber').matches(/^\d{15}$/).withMessage('Account number must be a 15-digit string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    try {
      const account = await Account.findOne({
        where: { accountNumber }
      });
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({
          message: `Account with number ${accountNumber} not found`
        });
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(
        `Server error while trying to get account by number: ${err}`);
      next(err);
    }
  }
];

export const getAccountByName = [
  param('name').isString().withMessage('Name must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.params;
    try {
      const account = await Account.findAll({
        where: { name }
      });
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({
          message: `Account with name ${name} not found`
        });
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(
        `Server error while trying to get account by name: ${err}`);
      next(err);
    }
  }
];

export const getAccountByType = [
  param('accountType').isIn(['checking', 'savings', 'credit']).withMessage('Account type must be one of: checking, savings, credit'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'DESC';
    const { accountType } = req.params;
    try {
      const account = await Account.findAll({
        where: { accountType },
        limit,
        offset,
        order: [[sort, order]]
      });
      if (account.length > 0) {
        res.status(200).json({
          message: `${account.length} accounts of type ${accountType} retrieved`,
          limit,
          offset,
          sort,
          order,
          accounts: account
        });
      } else {
        res.status(404).json({
          message: `No accounts of type ${accountType} found`,
          limit,
          offset,
          sort,
          order
        });
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(
        `Server error while trying to get account by type: ${err}`);
      next(err);
    }
  }
];

export const getAccountByStatus = [
  param('status').isIn(['active', 'inactive']).withMessage('Status must be one of: active, inactive'),
  param('userId').isUUID().withMessage('User ID must be a valid UUID'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be one of: ASC, DESC'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'DESC';
    const { status, userId } = req.params;
    try {
      const account = await Account.findAll({
        where: { status, userId },
        limit,
        offset,
        order: [[sort, order]]
      });

      let message = '';
      if (account.length > 0) {
        message = `${account.length} accounts with status ${status} retrieved`;
      } else {
        message = `No accounts with status ${status} found`;
      }

      res.status(200).json({
        message,
        limit,
        offset,
        sort,
        order,
        accounts: account
      });
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(
       `Server error while trying to get account by status: ${err}`);
      next(err);
    }
  }
];

export const getAccountsByUserId = [
  param('userId').isUUID().withMessage('User ID must be a valid UUID'),
  query('limit').optional().isInt({ min: 1 })
    .withMessage('Limit must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 })
    .withMessage('Offset must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id'])
    .withMessage('Sort must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC'])
    .withMessage('Order must be one of: ASC, DESC'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'DESC';
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          message: `User with ID ${userId} not found`
        });
      }

      const accounts = await Account.findAll({
        where: { userId },
        limit,
        offset,
        order: [[sort, order]]
      });
      if (accounts.length > 0) {
        res.status(200).json({
          message: `${accounts.length} accounts found for user with ID ${userId}`,
          limit,
          offset,
          sort,
          order,
          accounts
        });
      } else {
        res.status(200).json({
          message: `User with ID ${userId} has no accounts`,
          limit,
          offset,
          sort,
          order,
          accounts: []
        });
      }
    } catch (err) {
      logger.error(
        `Server error while trying to get accounts by user ID: ${err}`);
      next(err);
    }
  }
];

export const createAccount = [
  body('name')
    .matches(/^[a-zA-Z ]+$/)
    .withMessage('Name must be only alphabetical chars and spaces'),
  body('balance')
    .isNumeric()
    .withMessage('Balance must be a number'),
  body('accountType')
    .isIn([
      'checking',
      'savings',
      'credit',
      'CD',
      'moneyMarket',
      'prepaid',
      'businessChecking',
      'studentChecking',
      'travelersCheck',
      'paypal'
    ])
    .withMessage('Account type must be one of: checking, savings, credit'),
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'KSH'])
    .withMessage('Currency must be one of: USD, EUR, GBP'),
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be one of: active, inactive'),
  body('userId')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  body('interestRate')
    .optional({ checkFalsy: true })
    .isNumeric().withMessage('Interest rate must be a number'),

  body('overdraftLimit')
    .optional({ checkFalsy: true })
    .isNumeric().withMessage('Overdraft limit must be a number'),

  body('lastTransactionDate')
    .optional().isISO8601()
    .withMessage('Last transaction date must be a valid ISO 8601 date'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      balance,
      accountType,
      currency,
      status,
      userId,
      interestRate,
      overdraftLimit,
      lastTransactionDate
    } = req.body;

    // Generate a unique account number
    const accountNumber = generateUniqueAccountNumber();

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          message: `User with ID ${userId} not found`
        });
      }

      const newAccount = await Account.create({
        accountNumber,
        name,
        balance,
        accountType,
        currency,
        status,
        userId,
        interestRate,
        overdraftLimit,
        lastTransactionDate
      });

      res.status(201).json({
        message: 'Account created', account: newAccount
      });
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(`Server error while trying to create account: ${err}`);
      next(err);
    }
  }
];

export const updateAccount = [
  param('accountNumber').isString().withMessage('Account number must be a string'),
  body('name').isString().withMessage('Name must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Account name is required for update'
      });
    }

    try {
      const account = await getAccount(accountNumber);
      if (!account) {
        return res.status(404).json({
          message: `Account with number ${accountNumber} not found`
        });
      }

      await Account.update(
        { name },
        { where: { accountNumber } }
      );

      const updatedAccount = await getAccount(accountNumber);

      res.status(200).json({
        message: 'Account updated', account: updatedAccount
      });
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(`Server error while trying to update account: ${err}`);
      next(err);
    }
  }
];

export const activateAccount = [
  param('accountNumber').isString().withMessage('Account number must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    try {
      const account = await getAccount(accountNumber);
      if (!account) {
        return res.status(404).json({
          message: `Account with number ${accountNumber} not found`
        });
      }

      if (account.status === 'active') {
        return res.status(400).json({
          message: `Account with number ${accountNumber} is already active`
        });
      }

      if (account.balance < 100) {
        return res.status(400).json({
          message: `Account with number ${accountNumber} has insufficient funds`
        });
      } else {
        account.balance -= 100;
      }

      await Account.update(
        { status: 'active' },
        { where: { accountNumber } }
      );
      const updatedAccount = await Account.findOne({
        where: { accountNumber }
      });
      res.status(200).json({
        message: 'Account activated', account: updatedAccount
      });
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      logger.error(`Server error while trying to activate account: ${err}`);
      next(err);
    }
  }
];

export const deleteAccount = [
  param('accountNumber').isString().withMessage('Account number must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber } = req.params;
    try {
      const account = await getAccount(accountNumber);
      if (!account) {
        return res.status(404).json({
          message: `Account with number ${accountNumber} not found`
        });
      }

      const transaction = await sequelize.transaction();

      try {
        const deleteAccount = await Account.destroy({
          where: { accountNumber }
        }, { transaction });

        if (deleteAccount) {
          await transaction.commit();
          res.status(200).json({
            message: `Account with number ${accountNumber} deleted`
          });
        } else {
          throw new Error('Account not deleted');
        }
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      if (err instanceof Sequelize.DatabaseError) {
        return handleDatabaseError(res, err);
      }
      if (err instanceof Sequelize.ValidationError) {
        return handleValidationError(res, err.message);
      }
      logger.error(`Server error while trying to delete account: ${err}`);
      next(err);
    }
  }
];
