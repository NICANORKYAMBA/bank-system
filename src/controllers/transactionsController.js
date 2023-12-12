const Transaction = require('../models/transactions');
const Account = require('../models/accounts');
const { validationResult } = require('express-validator');
const logger = require('./logger');

const handleErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}

exports.createTransaction = async (req, res) => {
    handleErrors(req, res);
    const { type, amount, sourceAccountId, destinationAccountId, userId, description } = req.body;
    try {
        let sourceAccount = await Account.findByPk(sourceAccountId);
        if (!sourceAccount) {
            return res.status(404).json({ message: `Source account with ID ${sourceAccountId} not found` });
        }

        if (sourceAccount.status !== 'active') {
            return res.status(400).json({ message: 'Source account is not active' });
        }

        if (type === 'withdrawal' || type === 'transfer') {
            if (sourceAccount.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }
            sourceAccount.balance = (Number(sourceAccount.balance) - amount).toFixed(2);
            await sourceAccount.save();
            sourceAccount = await Account.findByPk(sourceAccountId); // Re-fetch the source account
        }

        if (type === 'deposit') {
            sourceAccount.balance = (Number(sourceAccount.balance) + amount).toFixed(2);
            await sourceAccount.save();
            sourceAccount = await Account.findByPk(sourceAccountId); // Re-fetch the source account
        }

        let destinationAccount;
        if (type === 'transfer') {
            destinationAccount = await Account.findByPk(destinationAccountId);
            if (!destinationAccount) {
                return res.status(404).json({ message: `Destination account with ID ${destinationAccountId} not found` });
            }
            if (destinationAccount.status !== 'active') {
                return res.status(400).json({ message: 'Destination account is not active' });
            }
            destinationAccount.balance = (Number(destinationAccount.balance) + amount).toFixed(2);
            await destinationAccount.save();
        }

        const transaction = {
            type,
            amount,
            currency: sourceAccount.currency,
            status: 'completed',
            sourceAccount: sourceAccount.accountNumber,
            destinationAccount: destinationAccount ? destinationAccount.accountNumber : sourceAccount.accountNumber,
            userId,
            accountId: sourceAccountId,
            sourceAccountId,
            destinationAccountId: destinationAccountId ? destinationAccountId : sourceAccountId, // Set destinationAccountId to sourceAccountId for 'deposit' transactions
            description
        };

        await Transaction.create(transaction);

        let message = `A ${type} transaction of ${amount} ${sourceAccount.currency} was made on account ${sourceAccount.accountNumber}.`;
        if (type === 'transfer') {
            message += ` The amount was transferred to account ${destinationAccount.accountNumber}.`;
        }
        message += ` The balance after the transaction is ${sourceAccount.balance} ${sourceAccount.currency}.`;

        res.status(201).json({
            transaction,
            balanceAfterTransaction: sourceAccount.balance,
            message
        });
    } catch (err) {
        logger.error(`Server error while trying to create transaction: ${err}`);
        res.status(500).json({
            error: 'Server error while trying to create transaction',
            message: err.message
        });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                {
                    model: Account,
                    as: 'sourceTransactionAccount', // Changed 'sourceAccount' to 'sourceTransactionAccount'
                    attributes: ['accountNumber', 'name', 'balance', 'currency']
                },
                {
                    model: Account,
                    as: 'destinationTransactionAccount', // Changed 'destinationAccount' to 'destinationTransactionAccount'
                    attributes: ['accountNumber', 'name', 'balance', 'currency']
                }
            ]
        });

        if (transactions.length > 0) {
            res.status(200).json({
                message: `${transactions.length} transactions found`,
                transactions
            });
        } else {
            res.status(404).json({ message: 'No transactions found' });
        }
    } catch (err) {
        logger.error(`Server error while trying to fetch transactions: ${err}`);
        res.status(500).json({
            error: 'Server error while trying to fetch transactions',
            message: err.message
        });
    }
};
