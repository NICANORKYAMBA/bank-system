const { validationResult } = require('express-validator');
const sequelize = require('../database');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UserAddress = require('../models/userAddress');
const logger = require('./logger');

const saltRounds = 10;

// Handle validation errors
const handleErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
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
    logger.error(`Server error while trying to fetch all users: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch all users',
      message: err.message
    });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: ['Addresses', 'Accounts'] });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch user: ${err}`);
    res.status(500).json({
      error: 'Server error while trying to fetch user',
      message: err.message
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  handleErrors(req, res);
  const { email, address, password, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: `User with email ${email} already exists`
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // If an address was provided, create it
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
    logger.error(`Server error while trying to create user: ${err.message}`);
    res.status(500).json({
      error: 'Server error while trying to create user',
      message: err.message
    });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  const { password, address } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    // If a new password was provided, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
    }

    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      // If an address was provided, update it
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
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Update failed. The update would violate a unique constraint.',
        fields: error.fields
      });
    }
    logger.error(`Server error while trying to update user: ${error.message}`);
    return res.status(500).json({
      error: 'Server error while trying to update user',
      message: error.message
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${id} not found`
      });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete the user within the transaction
      const deleted = await User.destroy({ where: { id } }, { transaction });

      if (deleted) {
        // If the delete was successful, commit the transaction
        await transaction.commit();
        return res.status(200).json({ message: 'User deleted', user });
      }
      throw new Error('User not deleted');
    } catch (err) {
      // If there was an error, rollback the transaction
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    logger.error(`Server error while trying to delete user: ${err.message}`);
    res.status(500).json({
      error: 'Server error while trying to delete user',
      message: err.message
    });
  }
};
