import React from 'react';
import { Card, CardContent, Typography, IconButton, Paper, Chip, Avatar, useMediaQuery } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';

const useStyles = makeStyles((theme) => ({
  dashboardCard: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  dashboardCardContent: {
    padding: theme.spacing(3)
  },
  transactionCard: {
    flex: '0 0 auto',
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[10]
    }
  },
  transactionChip: {
    margin: theme.spacing(1, 0),
    '& .MuiChip-avatar': {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main
    }
  },
  transactionDetails: {
    color: theme.palette.text.primary,
    fontSize: '0.875rem'
  },
  scrollButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  }
}));

const TransactionsList = ({
  transactions,
  scrollTransactions,
  transactionsScrollContainerRef
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <DepositIcon />;
      case 'withdrawal':
        return <WithdrawIcon />;
      default:
        return <TransferIcon />;
    }
  };

  return (
    <Card className={classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom style={{ fontFamily: 'Roboto, sans-serif', color: theme.palette.primary.dark }}>
          Transactions
        </Typography>
        {!isMobile && (
          <IconButton onClick={() => scrollTransactions(-430)} className={classes.scrollButton}>
            <KeyboardArrowLeftIcon fontSize='large' color='primary' />
          </IconButton>
        )}
        <div ref={transactionsScrollContainerRef} style={{ overflowX: 'auto', display: 'flex' }}>
          {transactions.length > 0
            ? (
                transactions.map((transaction, index) => (
                  <Paper elevation={3} className={classes.transactionCard} key={index}>
                    <CardContent>
                      <Chip
                        avatar={<Avatar>{getTransactionIcon(transaction.type)}</Avatar>}
                        label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        className={classes.transactionChip}
                      />
                      <Typography className={classes.transactionDetails}>
                        Amount: {transaction.amount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Source Account: {transaction.sourceAccount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Destination Account: {transaction.destinationAccount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Description: {transaction.description}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
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
        {!isMobile && (
          <IconButton onClick={() => scrollTransactions(430)} className={classes.scrollButton}>
            <KeyboardArrowRightIcon fontSize='large' color='primary' />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
