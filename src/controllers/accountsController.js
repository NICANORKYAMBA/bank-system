import Account from '../models/accounts.js';
import User from '../models/user.js';
import sequelize from '../database.js';
import { validationResult } from 'express-validator';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';
import logger from './logger.js';

const getAccount = async (accountNumber) => {
  return await Account.findOne({ where: { accountNumber } });
};

export const getAllAccounts = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';

  try {
    const accounts = await Account.findAll({
      include: ['User'],
      limit,
      offset,
      order: [[sort, order]]
    });
    if (accounts.length > 0) {
      res.status(200).json(accounts);
    } else {
      res.status(404).json({
        message: 'No accounts found'
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
};

export const getAccountByNumber = async (req, res, next) => {
  const { accountNumber } = req.params;
  try {
    const account = await Account.findOne({
      where: { accountNumber }, include: ['User']
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
};

export const getAccountByName = async (req, res, next) => {
  const { name } = req.params;
  try {
    const account = await Account.findAll({
      where: { name }, include: ['User']
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
};

export const createAccount = async (req, res, next) => {
  const {
    accountNumber,
    name,
    balance,
    accountType,
    currency,
    status,
    userId
  } = req.body;
  
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`
      });
    }

    const account = await getAccount(accountNumber);
    if (account) {
      return res.status(400).json({
        message: `Account with number ${accountNumber} already exists`
      });
    }

    const newAccount = await Account.create({
      accountNumber,
      name,
      balance,
      accountType,
      currency,
      status,
      userId
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
};

export const updateAccount = async (req, res, next) => {
  const { accountNumber } = req.params;
  const { name, balance, accountType, currency, status } = req.body;
  try {
    const account = await getAccount(accountNumber);
    if (!account) {
      return res.status(404).json({
        message: `Account with number ${accountNumber} not found`
      });
    }

    await Account.update(
      { name, balance, accountType, currency, status },
      { where: { accountNumber } }
    );
    const updatedAccount = await Account.findOne({
      where: { accountNumber }, include: ['User']
    });
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
};

export const deleteAccount = async (req, res, next) => {
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
};
