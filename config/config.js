require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_D,
    password: process.env.DB_PASSWORD_D,
    database: process.env.DB_NAME_D,
    host: process.env.DB_HOST_D,
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_USER_T,
    password: process.env.DB_PASSWORD_T,
    database: process.env.DB_NAME_T,
    host: process.env.DB_HOST_T,
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USER_P,
    password: process.env.DB_PASSWORD_P,
    database: process.env.DB_NAME_P,
    host: process.env.DB_HOST_P,
    dialect: "postgres"
  }
}
