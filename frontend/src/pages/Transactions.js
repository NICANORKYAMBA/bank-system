import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  makeStyles,
  Backdrop,
  Card,
  CardContent,
  Chip
} from '@material-ui/core';
import { fetchTransactions } from '../api/api';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  card: {
    margin: theme.spacing(2)
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  chip: {
    marginLeft: theme.spacing(1)
  }
}));

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Transactions = () => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    // Update the limit to 500 in the fetchTransactions call
    fetchTransactions(userId, 500, 0, 'createdAt', 'DESC')
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer':
        return <SwapHorizIcon className={classes.icon} color='action' />;
      case 'withdrawal':
        return <CallMadeIcon className={classes.icon} color='action' />;
      case 'deposit':
        return <CallReceivedIcon className={classes.icon} color='action' />;
      default:
        return <AccountBalanceIcon className={classes.icon} color='action' />;
    }
  };

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Typography variant='h4' gutterBottom>
        Transactions
      </Typography>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      {error && (
        <Typography variant='h6' color='error' align='center'>
          {error}
        </Typography>
      )}
      {!loading && !error && transactions.map((transaction) => (
        <Card key={transaction.id} className={classes.card}>
          <CardContent className={classes.cardContent}>
            <div>
              <Typography variant='h6' component='h2'>
                {getTransactionIcon(transaction.type)}
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </Typography>
              <Typography color='textSecondary'>
                {formatDate(transaction.createdAt)}
              </Typography>
            </div>
            <div>
              <Typography variant='h5'>
                <MonetizationOnIcon className={classes.icon} color='action' />
                {transaction.amount}
              </Typography>
              {transaction.sourceTransactionAccount && (
                <Chip label={`From: ${transaction.sourceTransactionAccount.accountNumber}`} className={classes.chip} />
              )}
              {transaction.destinationTransactionAccount && (
                <Chip label={`To: ${transaction.destinationTransactionAccount.accountNumber}`} className={classes.chip} />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Transactions;