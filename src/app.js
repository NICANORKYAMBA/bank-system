const express = require('express');
const accountsRoutes = require('./routes/accounts');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the accounts routes for requests to /api/accounts
app.use('/api/accounts', accountsRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Banking API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Banking API listening at http://localhost:${port}`);
});