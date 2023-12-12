const express = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = express.Router();

router.post('/', transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);

module.exports = router;