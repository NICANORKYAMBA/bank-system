'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Accounts', 'balance', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 100
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Accounts', 'balance', {
      type: Sequelize.DECIMAL(15, 5), // Assuming the original scale was 5
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 100
      }
    });
  }
};
