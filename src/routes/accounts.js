import express from 'express';
import {
  getAllAccounts,
  getAccountByNumber,
  getAccountByName,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountsController.js';

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAllAccounts);
router.get('/:accountNumber', getAccountByNumber);
router.put('/:accountNumber', updateAccount);
router.delete('/:accountNumber', deleteAccount);
router.get('/name/:name', getAccountByName);

export default router;
