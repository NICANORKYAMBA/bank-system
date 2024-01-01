import sequelize from '../database.js';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { body, param, query, validationResult } from 'express-validator';
import User from '../models/user.js';
import UserAddress from '../models/userAddress.js';
// import client from '../redis/redisClient.js';
import logger from './logger.js';
import {
  handleValidationError,
  handleDatabaseError
} from '../middlewares/errorHandler.js';

const saltRounds = 10;

export const getAllUsers = [
  query('limit').optional().isInt({ min: 1 }).withMessage('Must be an integer greater than 0'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Must be an integer greater than or equal to 0'),
  query('sort').optional().isIn(['createdAt', 'updatedAt', 'id']).withMessage('Must be one of: createdAt, updatedAt, id'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Must be one of: ASC, DESC'),
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
  }
];

export const getUserById = [
  param('id').isUUID().withMessage('Must be a valid UUID'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];

export const createUser = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  body('firstName').isAlpha().withMessage('Must be only alphabetical chars'),
  body('lastName').isAlpha().withMessage('Must be only alphabetical chars'),
  body('address.street').optional().isString().withMessage('Must be a string'),
  body('address.city').optional().isString().withMessage('Must be a string'),
  body('address.state').optional().isString().withMessage('Must be a string'),
  body('address.country').optional().isString().withMessage('Must be a string'),
  body('address.zipCode').optional().isString().withMessage('Must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];

export const loginUser = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

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
        message: 'Authentication successful',
        token,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName
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
  }
];

export const forgotPassword = [
  body('email').isEmail().withMessage('Must be a valid email'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];

export const updateUser = [
  body('password').optional().isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  body('address.street').optional().isString().withMessage('Must be a string'),
  body('address.city').optional().isString().withMessage('Must be a string'),
  body('address.state').optional().isString().withMessage('Must be a string'),
  body('address.country').optional().isString().withMessage('Must be a string'),
  body('address.zipCode').optional().isString().withMessage('Must be a string'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];

export const deleteUser = [
  param('id').isUUID().withMessage('Must be a valid UUID'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
];
