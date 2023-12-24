import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import styles from './transactionDetails.module.css';

function Transactions() {
  const transactions = [
    { id: 'a4ed8594-b972-458b-a65a-c9c0626fcb00', type: 'Deposit', amount: '1000', date: '2022-01-01', accountNumber: '1234567890' },
      { id: 'a4ed8594-b972-458b-a65a-c9c0626fcb00', type: 'Withdrawal', amount: '500', date: '2022-01-02', accountNumber: '1234567890' },
        { id: 'a4ed8594-b972-458b-a65a-c9c0626fcb00', type: 'Deposit', amount: '1000', date: '2022-01-01', accountNumber: '0987654321' },
      { id: 'a4ed8594-b972-458b-a65a-c9c0626fcb00', type: 'Withdrawal', amount: '500', date: '2022-01-02', accountNumber: '0987654321' },
        { id: 'a4ed8594-b972-458b-a65a-c9c0626fcb00', type: 'Transfer', amount: '1000', date: '2022-01-01', accountNumber: '1234567890' },
  ];

  return (
    <Container className={styles.container}>
      <Typography variant='h4' component='h1' gutterBottom>
        Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Account Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell component="th" scope="row">
                  {transaction.id}
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell align="right">{transaction.type}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{transaction.accountNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Transactions;