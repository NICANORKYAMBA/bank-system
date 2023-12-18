import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  reverseTransaction,
  getTransactionsByAccountId,
  getAccountStatements,
  deleteTransactionsByAccountId,
  deleteTransactionsByAccountNumber,
  deleteTransactionsByUserId,
  getTransactionsByUserId,
  getTransactionsByAccountNumber
} from '../controllers/transactionsController.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.delete('/:id', deleteTransaction);
router.post('/:id/reverse', reverseTransaction);

router.get('/account/:accountId', getTransactionsByAccountId);
router.get('/account-statements/:userId', getAccountStatements);
router.delete('/account/:accountId', deleteTransactionsByAccountId);
router.delete('/account/:accountNumber', deleteTransactionsByAccountNumber);
router.delete('/user/:userId', deleteTransactionsByUserId);
router.get('/user/:userId', getTransactionsByUserId);
router.get('/account/:accountNumber', getTransactionsByAccountNumber);

export default router;
