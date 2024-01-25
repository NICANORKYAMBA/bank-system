'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      type: {
        type: Sequelize.ENUM(
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
 type: Sequelize.DECIMAL,
 allowNull: false,
 validate: {
    isDecimal: true,
    min: 100
 }
},
balance: {
 type: Sequelize.DECIMAL,
 allowNull: false,
 validate: {
    isDecimal: true
 }
},
currency: {
 type: Sequelize.ENUM('USD', 'EUR', 'GBP', 'KSH'),
 allowNull: false
},
status: {
 type: Sequelize.ENUM('pending', 'completed', 'failed'),
 allowNull: false
},
sourceAccount: {
 type: Sequelize.STRING,
 allowNull: true
},
destinationAccount: {
 type: Sequelize.STRING,
 allowNull: true
},
transactionDate: {
 type: Sequelize.DATE,
 allowNull: false,
 defaultValue: Sequelize.NOW
},
description: {
 type: Sequelize.STRING,
 allowNull: true
},
userId: {
 type: Sequelize.UUID,
 allowNull: false,
 references: {
    model: 'Users',
    key: 'id'
 }
},
accountId: {
 type: Sequelize.UUID,
 allowNull: false,
 references: {
    model: 'Accounts',
    key: 'id'
 }
},
sourceAccountId: {
 type: Sequelize.UUID,
 allowNull: false,
 references: {
    model: 'Accounts',
    key: 'id'
 }
},
destinationAccountId: {
 type: Sequelize.UUID,
 allowNull: true,
 references: {
    model: 'Accounts',
    key: 'id'
 }
},
reversed: {
 type: Sequelize.BOOLEAN,
 allowNull: false,
 defaultValue: false
},
fee: {
 type: Sequelize.DECIMAL,
 allowNull: true,
 validate: {
    isDecimal: true
 }
},
exchangeRate: {
 type: Sequelize.DECIMAL,
 allowNull: true,
 validate: {
    isDecimal: true
 }
},
transactionReference: {
 type: Sequelize.STRING,
 allowNull: false,
 unique: true
},
authorizedBy: {
 type: Sequelize.STRING,
 allowNull: true
},
channel: {
 type: Sequelize.ENUM('online', 'branch', 'ATM', 'mobile'),
 allowNull: false
},
ipAddress: {
 type: Sequelize.STRING,
 allowNull: true
},
deviceInformation: {
 type: Sequelize.STRING,
 allowNull: true
},
checkNumber: {
 type: Sequelize.STRING,
 allowNull: true
},
attachmentUrl: {
 type: Sequelize.STRING,
 allowNull: true
},
deletedAt: {
 type: Sequelize.DATE,
 allowNull: true
},
statusChangedAt: {
 type: Sequelize.DATE,
 allowNull: true
},
notes: {
 type: Sequelize.TEXT,
 allowNull: true
},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
 }
};