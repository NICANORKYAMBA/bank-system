import Account from '../models/accounts.js';
import User from '../models/user.js';
import sequelize from '../database.js';
import { validationResult } from 'express-validator';
import logger from './logger.js';

const handleErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

const getAccount = async (accountNumber) => {
  return await Account.findOne({ where: { accountNumber } });
};

export const getAllAccounts = async (req, res) => {
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
      res.status(404).json({ message: 'No accounts found' });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch all accounts: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch all accounts',
      message: err.message
    });
  }
};

export const getAccountByNumber = async (req, res) => {
  handleErrors(req, res);
  const { accountNumber } = req.params;
  try {
    const account = await Account.findOne({ where: { accountNumber }, include: ['User'] });
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: `Account with number ${accountNumber} not found` });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch account: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch account',
      message: err.message
    });
  }
};

export const getAccountByName = async (req, res) => {
  handleErrors(req, res);
  const { name } = req.params;
  try {
    const account = await Account.findAll({ where: { name }, include: ['User'] });
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: `Account with name ${name} not found` });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch account: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch account',
      message: err.message
    });
  }
};

export const createAccount = async (req, res) => {
  handleErrors(req, res);
  const { accountNumber, name, balance, accountType, currency, status, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    const account = await getAccount(accountNumber);
    if (account) {
      return res.status(400).json({ message: `Account with number ${accountNumber} already exists` });
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

    res.status(201).json({ message: 'Account created', account: newAccount });
  } catch (err) {
    logger.error(`Server error while trying to create account: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to create account',
      message: err.message
    });
  }
};

export const updateAccount = async (req, res) => {
  handleErrors(req, res);
  const { accountNumber } = req.params;
  const { name, balance, accountType, currency, status } = req.body;
  try {
    const account = await getAccount(accountNumber);
    if (!account) {
      return res.status(404).json({ message: `Account with number ${accountNumber} not found` });
    }

    await Account.update(
      { name, balance, accountType, currency, status },
      { where: { accountNumber } }
    );
    const updatedAccount = await Account.findOne({ where: { accountNumber }, include: ['User'] });
    res.status(200).json({ message: 'Account updated', account: updatedAccount });
  } catch (err) {
    logger.error(`Server error while trying to update account: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to update account',
      message: err.message
    });
  }
};

export const deleteAccount = async (req, res) => {
  handleErrors(req, res);
  const { accountNumber } = req.params;
  try {
    const account = await getAccount(accountNumber);
    if (!account) {
      return res.status(404).json({ message: `Account with number ${accountNumber} not found` });
    }

    const transaction = await sequelize.transaction();

    try {
      const deleteAccount = await Account.destroy({ where: { accountNumber } }, { transaction });

      if (deleteAccount) {
        await transaction.commit();
        res.status(200).json({ message: `Account with number ${accountNumber} deleted` });
      } else {
        throw new Error('Account not deleted');
      }
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    logger.error(`Server error while trying to delete account: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to delete account',
      message: err.message
    });
  }
};
