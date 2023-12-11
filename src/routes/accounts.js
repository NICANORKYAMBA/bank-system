const express = require('express');
const accountsController = require('../controllers/accountsController');

const router = express.Router();

router.get('/', accountsController.getAllAccounts);
router.get('/number/:accountNumber', accountsController.getAccountByNumber);
router.post('/', accountsController.createAccount);
router.put('/number/:accountNumber', accountsController.updateAccount);
router.delete('/number/:accountNumber', accountsController.deleteAccount);
router.get('/name/:name', accountsController.getAccountByName);

module.exports = router;
