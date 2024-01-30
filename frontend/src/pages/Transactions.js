import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  CircularProgress,
  makeStyles,
  Backdrop,
  Card,
  CardContent,
  Chip,
  Box,
  TextField,
  Button,
  Select,
  MenuItem
} from '@material-ui/core';
import QuickActions from '../components/QuickActions';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import {
  fetchAccounts,
  fetchTransactions,
  setFilterFromAccount,
  setFilterToAccount,
  setFilterTransactionType,
  clearFilters,
  hideForms,
  incrementTransactionCount
} from '../redux/actions/TransactionActions';
import { selectFilteredTransactions } from '../redux/selectors/TransactionSelectors';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    marginTop: theme.spacing(-8),
    marginLeft: theme.spacing(30),
    marginRight: 'auto',
    maxWidth: `calc(100% - ${theme.spacing(30)}px)`
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
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Transactions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const transactionState = useSelector(state => state.transaction);

  const {
    data: {
      accounts
    },
    loading,
    error,
    showDepositForm,
    showTransferForm,
    showWithdrawalForm,
    filterFromAccount,
    filterToAccount,
    filterTransactionType
  } = transactionState;

  const filteredTransactions = useSelector(
    state => selectFilteredTransactions(state,
      filterFromAccount, filterToAccount, filterTransactionType));

  const userData = useSelector(state => state.loginForm.userData || {});

  useEffect(() => {
    if (userData.userId) {
      dispatch(fetchTransactions(userData.userId, 500, 0, 'createdAt', 'DESC'));
      dispatch(fetchAccounts(userData.userId));
    }
  }, [userData.userId, dispatch]);

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

  const handleDepositClick = () => dispatch(showDepositForm());
  const handleTransferClick = () => dispatch(showTransferForm());
  const handleWithdrawalClick = () => dispatch(showWithdrawalForm());
  const handleClose = () => {
    dispatch(hideForms());
  };

  const userFirstName = userData.firstName || 'User';

  const handleTransactionCreated = () => {
    dispatch(incrementTransactionCount());
  };

  return (
    <Container maxWidth='lg' className={classes.container}>
      <Typography variant='h4' gutterBottom>
        Transactions
      </Typography>
      <Box display='flex' justifyContent='space-between' mb={2}>
        <TextField
          label='Filter From Account'
          variant='outlined'
          value={filterFromAccount}
          onChange={(e) => {
            dispatch(setFilterFromAccount(e.target.value));
          }}
        />
        <TextField
          label='Filter To Account'
          variant='outlined'
          value={filterToAccount}
          onChange={(e) => {
            dispatch(setFilterToAccount(e.target.value));
          }}
        />
        <Select
          value={filterTransactionType}
          onChange={(e) => {
            dispatch(setFilterTransactionType(e.target.value));
          }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value=''>
            <em>All Types</em>
          </MenuItem>
          <MenuItem value='deposit'>Deposit</MenuItem>
          <MenuItem value='withdrawal'>Withdrawal</MenuItem>
          <MenuItem value='transfer'>Transfer</MenuItem>
        </Select>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => dispatch(clearFilters())}
        >
          Clear Filters
        </Button>
      </Box>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      {error && (
        <Typography variant='h6' color='error' align='center'>
          {error}
        </Typography>
      )}
      {!loading && !error && filteredTransactions.length === 0 && (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          minHeight='50vh'
        >
          <Typography variant='h5' gutterBottom>
            Welcome, {userFirstName}!
          </Typography>
          <Typography variant='subtitle1' align='center'>
            It looks like you haven't made any transactions yet. <br />
            Get started with one of the actions below!
          </Typography>
          <QuickActions
            accountsData={accounts}
            handleDepositClick={handleDepositClick}
            handleTransferClick={handleTransferClick}
            handleWithdrawalClick={handleWithdrawalClick}
            showDepositForm={showDepositForm}
            showTransferForm={showTransferForm}
            showWithdrawalForm={showWithdrawalForm}
            handleCloseDeposit={handleClose}
            handleClose={handleClose}
            handleCloseWithdrawal={handleClose}
            onTransactionCreated={handleTransactionCreated}
          />
        </Box>
      )}
      {!loading && !error && filteredTransactions.length > 0 && filteredTransactions.map((transaction) => (
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
