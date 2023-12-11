'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [15, 15]
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      balance: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      accountType: {
        type: Sequelize.ENUM('checking', 'savings', 'credit'),
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('USD', 'EUR', 'GBP'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('Accounts');
  },
};