const express = require('express');
const accountsController = require('../controllers/accountsController');

const router = express.Router();

router.post('/', accountsController.createAccount);
router.get('/', accountsController.getAllAccounts);
router.get('/:accountNumber', accountsController.getAccountByNumber);
router.put('/:accountNumber', accountsController.updateAccount);
router.delete('/:accountNumber', accountsController.deleteAccount);
router.get('/name/:name', accountsController.getAccountByName);

module.exports = router;
