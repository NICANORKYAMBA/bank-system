const { Account } = require('../models/account');
const { validationResult } = require('express-validator');

const handleErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

const getAccount = async (accountNumber) => {
    return await Account.findOne({ where: { accountNumber } });
};

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Server error while trying to fetch all accounts' });
    }
};

exports.getAccountByNumber = async (req, res) => {
    handleErrors(req, res);
    const { accountNumber } = req.params;
    try {
        const account = await getAccount(accountNumber);
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: `Account with number ${accountNumber} not found` });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while trying to fetch account' });
    }
};

exports.getAccountByName = async (req, res) => {
    handleErrors(req, res);
    const { name } = req.params;
    try {
        const account = await Account.findOne({ where: { name } });
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: `Account with name ${name} not found` });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while trying to fetch account' });
    }
};

exports.createAccount = async (req, res) => {
    handleErrors(req, res);
    const { accountNumber } = req.body;
    try {
        const existingAccount = await getAccount(accountNumber);
        if (existingAccount) {
            return res.status(400).json({ message: `Account with number ${accountNumber} already exists` });
        }

        const newAccount = await Account.create(req.body);
        res.status(201).json({ message: 'Account created', account: newAccount });
    } catch (err) {
        res.status(500).json({ error: 'Server error while trying to create account' });
    }
};

exports.updateAccount = async (req, res) => {
    handleErrors(req, res);
    const { accountNumber } = req.params;
    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            return res.status(404).json({ message: `Account with number ${accountNumber} not found` });
        }

        const [updated] = await Account.update(req.body, { where: { accountNumber } });

        if (updated) {
            const updatedAccount = await getAccount(accountNumber);
            return res.status(200).json({ message: 'Account updated', account: updatedAccount });
        }
        throw new Error('Account not updated');
    } catch (error) {
        return res.status(500).json({ message: 'Server error while trying to update account' });
    }
};

exports.deleteAccount = async (req, res) => {
    handleErrors(req, res);
    const { accountNumber } = req.params;
    try {
        const account = await getAccount(accountNumber);
        if (!account) {
            return res.status(404).json({ message: `Account with number ${accountNumber} not found` });
        }

        await Account.destroy({ where: { accountNumber } });
        res.status(200).json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error while trying to delete account' });
    }
};