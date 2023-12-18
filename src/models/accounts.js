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
    validate: {
      isAlpha: true
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
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
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
