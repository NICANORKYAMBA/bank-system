'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Accounts', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      accountNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      balance: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      accountType: {
        type: Sequelize.DataTypes.ENUM('checking', 'savings', 'credit', 'CD', 'moneyMarket', 'prepaid', 'businessChecking', 'studentChecking', 'travelersCheck', 'paypal'),
        allowNull: false
      },
      currency: {
        type: Sequelize.DataTypes.ENUM('USD', 'EUR', 'GBP', 'KSH'),
        allowNull: false
      },
      status: {
        type: Sequelize.DataTypes.ENUM('active', 'inactive'),
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      interestRate: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      overdraftLimit: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: true
      },
      lastTransactionDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
      },
      creationDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Accounts');
  }
};