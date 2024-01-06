import React from 'react';
import { Card, CardContent, Typography, IconButton, Paper, Chip } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';

const TransactionsList = ({
  classes,
  transactions,
  scrollTransactions,
  transactionsScrollContainerRef
}) => {
  return (
    <Card className={classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom>
          Transactions
        </Typography>
        <IconButton onClick={() => scrollTransactions(-430)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', margin: '0 8px', padding: '10px' }}>
          <ArrowBackIosIcon style={{ fontSize: '1rem', color: '#3f51b5' }} />
        </IconButton>
        <div ref={transactionsScrollContainerRef} style={{ overflowX: 'auto', display: 'flex' }}>
          {transactions.length > 0
            ? (
                transactions.map((transaction, index) => (
                  <Paper elevation={3} className={classes.transactionCard} key={index} style={{ flex: '0 0 auto', padding: '10px', margin: '10px' }}>
                    <CardContent>
                      <Chip
                        icon={
                          transaction.type === 'deposit'
                            ? <DepositIcon />
                            : transaction.type === 'withdrawal'
                              ? <WithdrawIcon />
                              : <TransferIcon />
                        }
                        label={`Type: ${transaction.type}`}
                        color={transaction.type === 'deposit' ? 'primary' : transaction.type === 'withdrawal' ? 'secondary' : 'default'}
                        style={{ margin: '10px 0' }}
                      />
                      <Typography color='textSecondary' style={{ color: '#3f51b5' }}>
                        Amount: {transaction.amount}
                      </Typography>
                      <Typography color='textSecondary' style={{ color: '#3f51b5' }}>
                        Source Account: {transaction.sourceAccount}
                      </Typography>
                      <Typography color='textSecondary' style={{ color: '#3f51b5' }}>
                        Destination Account: {transaction.destinationAccount}
                      </Typography>
                      <Typography color='textSecondary' style={{ color: '#3f51b5' }}>
                        Description: {transaction.description}
                      </Typography>
                      <Typography color='textSecondary' style={{ color: '#3f51b5' }}>
                        Date: {new Date(transaction.transactionDate).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Paper>
                ))
              )
            : (
              <Typography color='textSecondary'>
                No transactions found.
              </Typography>
              )}
        </div>
        <IconButton onClick={() => scrollTransactions(430)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', margin: '0 8px', padding: '10px' }}>
          <ArrowForwardIosIcon style={{ fontSize: '1rem', color: '#3f51b5' }} />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
