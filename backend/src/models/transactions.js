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
    type: DataTypes.ENUM(
      'deposit',
      'withdrawal',
      'transfer',
      'interest',
      'fee',
      'loanDisbursement',
      'loanRepayment',
      'billPayment',
      'directDebit',
      'standingOrder',
      'refund',
      'chargeback',
      'foreignExchange',
      'cashDeposit',
      'cashWithdrawal',
      'checkDeposit',
      'checkCashing'
    ),
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
  balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      isDecimal: true
    }
  },
  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'KSH'),
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
  },
  fee: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    validate: {
      isDecimal: true
    }
  },
  exchangeRate: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    validate: {
      isDecimal: true
    }
  },
  transactionReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  authorizedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  channel: {
    type: DataTypes.ENUM('online', 'branch', 'ATM', 'mobile'),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deviceInformation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checkNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statusChangedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeUpdate: (transaction, options) => {
      transaction.lastUpdated = new Date();
    }
  }
});

export default Transaction;
