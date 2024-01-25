module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
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
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 100
        }
      },
      accountType: {
        type: Sequelize.ENUM('checking', 'savings', 'credit', 'CD', 'moneyMarket', 'prepaid', 'businessChecking', 'studentChecking', 'travelersCheck', 'paypal'),
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('USD', 'EUR', 'GBP', 'KSH'),
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
          key: 'id'
        }
      },
      interestRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      overdraftLimit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      lastTransactionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      lastUpdated: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
 },
 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Accounts');
 }
};