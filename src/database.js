const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME_D,
  process.env.DB_USER_D,
  process.env.DB_PASSWORD_D, {
    host: process.env.DB_HOST_D,
    dialect: 'postgres'
  });

module.exports = sequelize;
