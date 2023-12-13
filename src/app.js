const express = require('express');
const accountsRoutes = require('./routes/accounts');
const userRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const ErrorHandler = require('./middlewares/errorHandler');

const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/accounts', accountsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Banking API!');
});

app.use(ErrorHandler);

const sequelize = new Sequelize(
  process.env.DB_NAME_D,
  process.env.DB_USER_D,
  process.env.DB_PASSWORD_D, {
    host: process.env.DB_HOST_D,
    dialect: 'postgres'
  });

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

require('./models/associations');

app.listen(port, () => {
  console.log(`Banking API listening at http://localhost:${port}`);
});
