const express = require('express');
const accountsController = require('../controllers/accountsController');

const router = express.Router();

router.get('/accounts', accountsController.getAllAccounts);
router.get('/accounts/:accountNumber', accountsController.getAccountByNumber);
router.post('/accounts', accountsController.createAccount);
router.put('/accounts/:accountNumber', accountsController.updateAccount);
router.delete('/accounts/:accountNumber', accountsController.deleteAccount);
router.get('/accounts/name/:name', accountsController.getAccountByName);

module.exports = router;