import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { Sequelize } from 'sequelize';
import cors from 'cors';
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
import deactivateInactiveAccounts from './middlewares/deactivateInactiveAccounts.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.on('finish', () => {
      console.log(`Request: ${req.method} ${req.originalUrl} Status Code: ${res.statusCode}`);
    });
  }
  next();
});

app.use('/api/accounts', accountsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Banking API!');
});

app.use(ErrorHandler);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  });

sequelize.authenticate()
  .then(() => console.log('Connected To Database Successfully!'))
  .catch(err => console.log('Error: ' + err));

cron.schedule('0 */12 * * *', () => {
  console.log('Applying interest to all Savings Accounts');
  applyInterestToAllAccounts();
});

cron.schedule('0 */12 * * *', () => {
  console.log('Deactivating inactive accounts!');
  deactivateInactiveAccounts();
});

app.listen(port, () => {
  console.log(`Banking API listening at http://localhost:${port}`);
});
