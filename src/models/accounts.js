require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,
  process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    dialect: 'postgres'
});

const Account = sequelize.define('Account', {
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      len: [15, 15]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  accountType: {
    type: DataTypes.ENUM('checking', 'savings', 'credit'),
    allowNull: false
  },
  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false
  }
}, {
  // Other model options go here
  timestamps: true,
  hooks: {
    beforeUpdate: (account, options) => {
      account.lastUpdated = new Date();
    }
  }
});

module.exports = Account;