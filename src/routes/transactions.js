const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.get('/account/number/:accountNumber', transactionsController.getTransactionsByAccountNumber);
router.get('/user/:userId', transactionsController.getTransactionsByUserId);
router.get('/account/id/:accountId', transactionsController.getTransactionsByAccountId);

module.exports = router;
