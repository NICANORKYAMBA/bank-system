const { validationResult } = require('express-validator');
const sequelize = require('../database');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UserAddress = require('../models/userAddress');
const logger = require('./logger');

const saltRounds = 10;

exports.getAllUsers = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'DESC';

  try {
    const users = await User.findAll({
      include: ['Addresses', 'Accounts'],
      limit,
      offset,
      order: [[sort, order]]
    });
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: ['Addresses', 'Accounts'] });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  } catch (err) {
    next(err);
  }
}

exports.createUser = async (req, res, next) => {
  const { email, address, password, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: `User with email ${email} already exists`
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    if (address) {
      try {
        await UserAddress.create({
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          zipCode: address.zipCode,
          userId: user.id
        });
      } catch (err) {
        logger.error(`Failed to create address: ${err.message}`);
        return res.status(400).json({
          message: 'User created, but failed to create address',
          error: err.message,
          user
        });
      }
    }

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { password, address } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
    }

    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      if (address) {
        await UserAddress.update(address, { where: { userId: id } });
      }
      const updatedUser = await User.findByPk(id, { include: ['Addresses', 'Accounts'] });
      return res.status(200).json({ message: 'User updated', user: updatedUser });
    } else {
      return res.status(400).json({
        message: 'Update failed. No fields to update or invalid fields provided.'
      });
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Update failed. The update would violate a unique constraint.',
        fields: err.fields
      });
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${id} not found`
      });
    }

    const transaction = await sequelize.transaction();

    try {
      const deleted = await User.destroy({ where: { id } }, { transaction });

      if (deleted) {
        await transaction.commit();
        return res.status(200).json({ message: 'User deleted', user });
      }
      throw new Error('User not deleted');
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    next(err);
  }
};
