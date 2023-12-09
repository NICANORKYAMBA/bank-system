const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
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

  try {
    const users = await User.findAll({ 
      include: ['Accounts', 'Addresses'],
      limit: limit,
      offset: offset
    });
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch all users: ${err.message}`);
    res.status(500).json({ error: 'Server error while trying to fetch all users', message: err.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: ['Accounts', 'Addresses'] });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with ID ${id} not found` });
    }
  } catch (err) {
    logger.error(`Server error while trying to fetch user: ${err.message}`);
    res.status(500).json({ error: 'Server error while trying to fetch user', message: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  handleErrors(req, res);
  const { email, addresses, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: `User with email ${email} already exists` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);

    // If addresses were provided, create them
    if (addresses && Array.isArray(addresses)) {
      const addressErrors = [];
      for (let address of addresses) {
        address.userId = user.id;
        try {
          await UserAddress.create(address);
        } catch (err) {
          addressErrors.push(`Failed to create address: ${err.message}`);
          logger.error(`Failed to create address: ${err.message}`);
        }
      }
      if (addressErrors.length > 0) {
        return res.status(400).json({ message: 'User created, but some addresses failed to be created', errors: addressErrors, user: user });
      }
    }

    res.status(201).json({ message: 'User created', user: user });
  } catch (err) {
    logger.error(`Server error while trying to create user: ${err.message}`);
    res.status(500).json({ error: 'Server error while trying to create user', message: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  const { password } = req.body;
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
      const updatedUser = await User.findByPk(id, { include: ['Accounts', 'Addresses'] });
      return res.status(200).json({ message: 'User updated', user: updatedUser });
    } else {
      return res.status(400).json({ message: 'Update failed. No fields to update or invalid fields provided.' });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Update failed. The update would violate a unique constraint.', fields: error.fields });
    }
    logger.error(`Server error while trying to update user: ${error.message}`);
    return res.status(500).json({ message: 'Server error while trying to update user', message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  handleErrors(req, res);
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      return res.status(200).json({ message: 'User deleted' });
    }
    throw new Error('User not deleted');
  } catch (err) {
    logger.error(`Server error while trying to delete user: ${err.message}`);
    res.status(500).json({ error: 'Server error while trying to delete user', message: err.message });
  }
};