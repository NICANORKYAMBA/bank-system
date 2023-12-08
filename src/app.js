const express = require('express');
const accountsRoutes = require('./routes/accounts');
const userRoutes = require('./routes/users');

const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/accounts', accountsRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Banking API!');
    console.log();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const sequelize = new Sequelize(process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

app.listen(port, () => {
    console.log(`Banking API listening at http://localhost:${port}`);
});