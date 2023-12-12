const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.get('/account/:accountNumber', transactionsController.getTransactionsByAccountNumber);

module.exports = router;
