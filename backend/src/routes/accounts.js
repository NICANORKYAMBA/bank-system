import express from 'express';
import {
  getAllAccounts,
  getAccountById,
  getAccountByNumber,
  getAccountByName,
  getAccountByType,
  getAccountByStatus,
  getAccountsByUserId,
  activateAccount,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountsController.js';

const router = express.Router();

router.post('/', createAccount);
router.get('/', getAllAccounts);
router.get('/id/:id', getAccountById);
router.get('/:accountNumber', getAccountByNumber);
router.put('/:accountNumber', updateAccount);
router.put('/:accountNumber/activate', activateAccount);
router.delete('/:accountNumber', deleteAccount);
router.get('/name/:name', getAccountByName);
router.get('/type/:accountType', getAccountByType);
router.get('/user/:userId/status/:status', getAccountByStatus);
router.get('/user/:userId', getAccountsByUserId);

export default router;
