const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Users',
  timestamps: true
});

module.exports = User;
