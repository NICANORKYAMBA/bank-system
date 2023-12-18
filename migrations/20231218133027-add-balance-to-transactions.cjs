'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transactions', 'balance', {
      type: Sequelize.DECIMAL,
      allowNull: true,
      validate: {
        isDecimal: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transactions', 'balance');
  }
};
