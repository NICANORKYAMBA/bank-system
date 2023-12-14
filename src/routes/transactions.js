const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.delete('/:id', transactionsController.deleteTransaction);
router.post('/:id/reverse', transactionsController.reverseTransaction);

router.get('/account/:accountId', transactionsController.getTransactionsByAccountId);
router.get('/user/:userId', transactionsController.getTransactionsByUserId);
router.get('/accountNumber/:accountNumber', transactionsController.getTransactionsByAccountNumber);

module.exports = router;
