import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 100
    }
  },
  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    allowNull: false
  },
  sourceAccount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  destinationAccount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  sourceAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  destinationAccountId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  reversed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (transaction, options) => {
      transaction.lastUpdated = new Date();
    }
  }
});

export default Transaction;
