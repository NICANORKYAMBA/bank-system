import sequelize from '../database.js';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import UserAddress from '../models/userAddress.js';
import logger from './logger.js';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';

const saltRounds = 10;

export const getAllUsers = async (req, res, next) => {
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
      res.status(200).json({
        message: `${users.length} users found`, users
      });
    } else {
      res.status(404).json({
        message: 'No users found'
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

export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { include: ['Addresses', 'Accounts'] });

    if (user) {
      res.status(200).json({
        message: `User with ID ${id} found`, user
      });
    } else {
      res.status(404).json({
        message: `User with ID ${id} not found`
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

export const createUser = async (req, res, next) => {
  const { email, address, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      message: 'Missing required fields'
    });
  }

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

    res.status(201).json({
      message: 'User created', user
    });
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

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed: User not found'
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: 'Authentication failed: Incorrect password'
      });
    }

    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Authentication successful', token
    });
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

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    try {
      await user.save();
    } catch (err) {
      console.error('Error saving user: ', err);
      return res.status(500).json({
        message: 'Error saving password reset token'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else)
      have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser
      to complete the process within one hour of receiving it:\n\n
      http://localhost:3000/reset/${resetToken}\n\n
      If you did not request this, please ignore this email
      and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Error sending email: ', err);
        return res.status(500).json({
          message: 'Error sending password reset email'
        });
      } else {
        res.status(200).json({ message: 'Password reset link sent' });
      }
    });
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

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { password, address } = req.body;

  if (password && password.trim() === '') {
    return res.status(400).json({
      message: 'Password cannot be empty'
    });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${id} not found`
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
    }

    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      if (address) {
        const updatedAddress = await UserAddress.update(
          address,
          { where: { userId: id } });
        if (!updatedAddress) {
          return res.status(400).json({
            message: 'Update failed. No address found to update.'
          });
        }
      }
      const updatedUser = await User.findByPk(id, { include: ['Addresses', 'Accounts'] });
      return res.status(200).json({
        message: 'User updated', user: updatedUser
      });
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

export const deleteUser = async (req, res, next) => {
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
        return res.status(200).json({
          message: `User with ID ${id} deleted`
        });
      } else {
        await transaction.rollback();
        return res.status(500).json({
          message: 'User not deleted'
        });
      }
    } catch (err) {
      await transaction.rollback();
      return res.status(500).json({
        message: 'Database error: ' + err.message
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
