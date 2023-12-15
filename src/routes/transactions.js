const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.delete('/:id', transactionsController.deleteTransaction);
router.post('/:id/reverse', transactionsController.reverseTransaction);

router.get('/account/:accountId', transactionsController.getTransactionsByAccountId);
router.get('/account-statements/:userId', transactionsController.getAccountStatements);
router.delete('/account/:accountId', transactionsController.deleteTransactionsByAccountId);
router.delete('/account/:accountNumber', transactionsController.deleteTransactionsByAccountNumber);
router.delete('/user/:userId', transactionsController.deleteTransactionsByUserId);
router.get('/user/:userId', transactionsController.getTransactionsByUserId);
router.get('/account/:accountNumber', transactionsController.getTransactionsByAccountNumber);

module.exports = router;
