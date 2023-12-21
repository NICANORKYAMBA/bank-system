import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  reverseTransaction,
  getTransactionsByAccountId,
  deleteTransactionsByAccountId,
  deleteTransactionsByAccountNumber,
  deleteTransactionsByUserId,
  getTransactionsByUserId,
  getTransactionsByAccountNumber,
  getAccountStatement
} from '../controllers/transactionsController.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.delete('/:id', deleteTransaction);
router.post('/:id/reverse', reverseTransaction);

router.get('/account/:accountId', getTransactionsByAccountId);
router.delete('/account/:accountId', deleteTransactionsByAccountId);
router.delete('/accountNumber/:accountNumber', deleteTransactionsByAccountNumber);
router.delete('/user/:userId', deleteTransactionsByUserId);
router.get('/statement/:accountNumber', getAccountStatement);
router.get('/user/:userId', getTransactionsByUserId);
router.get('/number/:accountNumber', getTransactionsByAccountNumber);

export default router;
