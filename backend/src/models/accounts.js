import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [15, 15]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Z ]+$/i
    }
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 100
    }
  },
  accountType: {
    type: DataTypes.ENUM('checking', 'savings', 'credit', 'CD', 'moneyMarket', 'prepaid', 'businessChecking', 'studentChecking', 'travelersCheck', 'paypal'),
    allowNull: false
  },
  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'KSH'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  overdraftLimit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  lastTransactionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (account, options) => {
      account.lastUpdated = new Date();
    }
  }
});

export default Account;
