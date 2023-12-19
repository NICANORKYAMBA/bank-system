import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { Sequelize } from 'sequelize';
import './models/user.js';
import './models/accounts.js';
import './models/transactions.js';
import './models/userAddress.js';
import './models/associations.js';
import accountsRoutes from './routes/accounts.js';
import userRoutes from './routes/users.js';
import transactionsRoutes from './routes/transactions.js';
import ErrorHandler from './middlewares/errorHandler.js';
import applyInterestToAllAccounts from './middlewares/calculateInterest.js';

dotenv.config();

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

cron.schedule('*/2 * * * *', () => {
  applyInterestToAllAccounts();
});

app.listen(port, () => {
  console.log(`Banking API listening at http://localhost:${port}`);
});
