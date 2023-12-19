import Account from '../models/accounts.js';
import User from '../models/user.js';
import { Sequelize } from 'sequelize';
import sequelize from '../database.js';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';
import logger from './logger.js';

const INTEREST_RATE = 0.05;

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
};

export const getAccountByName = async (req, res, next) => {
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
};

export const getAccountByType = async (req, res, next) => {
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
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({
        message: `Account with type ${accountType} not found`
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
};

export const getAccountByStatus = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';
  const { status } = req.params;
  try {
    const account = await Account.findAll({
      where: { status },
      limit,
      offset,
      order: [[sort, order]]
    });
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({
        message: `Account with status ${status} not found`
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
      `Server error while trying to get account by status: ${err}`);
    next(err);
  }
};

export const getAccountsByUserId = async (req, res, next) => {
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
      res.status(200).json(accounts);
    } else {
      res.status(404).json({
        message: `No accounts found for user with ID ${userId}`
      });
    }
  } catch (err) {
    logger.error(
      `Server error while trying to get accounts by user ID: ${err}`);
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
      where: { accountNumber }
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

export const activateAccount = async (req, res, next) => {
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

export const applyInterest = async (accountNumber) => {
  try {
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
  } catch (err) {
    console.error(`Server error while trying to apply interest to account: ${err}`);
  }
};
