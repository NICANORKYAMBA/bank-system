import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserId,
  getUserFirstName
} from '../redux/selectors/userSelectors';
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
  Grid,
  InputLabel,
  Button,
  Select,
  FormControl,
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
import {
  selectFilteredTransactions
} from '../redux/selectors/TransactionSelectors';

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
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  welcomeMessage: {
    marginBottom: theme.spacing(4)
  },
  quickActions: {
    marginTop: theme.spacing(4)
  },
  transactionCard: {
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius
  },
  transactionDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  transactionAmount: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(2)
  },
  transactionStatus: {
    color: theme.palette.success.main,
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(1)
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
    state => selectFilteredTransactions(
      state, filterFromAccount, filterToAccount, filterTransactionType));

  const userId = useSelector(getUserId);
  const firstName = useSelector(getUserFirstName);

  const transactionCount = useSelector(state => state.transaction.transactionCount);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactions(userId, 500, 0, 'createdAt', 'DESC'));
      dispatch(fetchAccounts(userId));
    }
  }, [userId, dispatch, transactionCount]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer':
        return <SwapHorizIcon
          className={classes.icon}
          color='action' />;
      case 'withdrawal':
        return <CallMadeIcon
          className={classes.icon}
          color='action' />;
      case 'deposit':
        return <CallReceivedIcon
          className={classes.icon}
          color='action' />;
      default:
        return <AccountBalanceIcon
          className={classes.icon}
          color='action' />;
    }
  };

  const handleDepositClick = () => dispatch(showDepositForm());
  const handleTransferClick = () => dispatch(showTransferForm());
  const handleWithdrawalClick = () => dispatch(showWithdrawalForm());
  const handleClose = () => {
    dispatch(hideForms());
  };

  const userFirstName = firstName || 'User';

  const handleTransactionCreated = () => {
    dispatch(incrementTransactionCount());
  };

  return (
    <Container
      maxWidth='lg'
      className={classes.container}>
      <Typography variant='h4' gutterBottom>
        Transactions
      </Typography>
      <Box
        display='flex' j
        ustifyContent='space-between'
        mb={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel
                id='filter-from-account-label'
              >
                Filter From Account
              </InputLabel>
              <Select
                labelId='filter-from-account-label'
                id='filter-from-account-select'
                value={filterFromAccount}
                onChange={(e) => {
                  dispatch(setFilterFromAccount(e.target.value));
                }}
                label='Filter From Account'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {accounts.map((account) => (
                  <MenuItem
                    key={account.accountNumber}
                    value={account.accountNumber}
                  >
                    {account.accountNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel
                id='filter-to-account-label'
              >
                Filter To Account
              </InputLabel>
              <Select
                labelId='filter-to-account-label'
                id='filter-to-account-select'
                value={filterToAccount}
                onChange={(e) => {
                  dispatch(setFilterToAccount(e.target.value));
                }}
                label='Filter To Account'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {accounts.map((account) => (
                  <MenuItem
                    key={account.accountNumber}
                    value={account.accountNumber}
                  >
                    {account.accountNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel
                id='filter-transaction-type-label'
              >
                Transaction Type
              </InputLabel>
              <Select
                labelId='filter-transaction-type-label'
                id='filter-transaction-type-select'
                value={filterTransactionType}
                onChange={(e) => {
                  dispatch(setFilterTransactionType(e.target.value));
                }}
                label='Transaction Type'
              >
                <MenuItem value=''>
                  <em>All Types</em>
                </MenuItem>
                <MenuItem value='deposit'>Deposit</MenuItem>
                <MenuItem value='withdrawal'>Withdrawal</MenuItem>
                <MenuItem value='transfer'>Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant='contained'
              color='secondary'
              fullWidth
              onClick={() => dispatch(clearFilters())}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Backdrop
        className={classes.backdrop}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {error && (
        <Typography
          variant='h6'
          color='error'
          align='center'
        >
          {error}
        </Typography>
      )}
      {!loading && !error &&
        filteredTransactions.length === 0 && (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          minHeight='50vh'
          className={classes.welcomeMessage}
        >
          <Typography
            variant='h5'
            gutterBottom
          >
            Welcome, {userFirstName}!
          </Typography>
          <Typography
            variant='subtitle1'
            align='center'
          >
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
            className={classes.quickActions}
          />
        </Box>
      )}
      {!loading && !error && filteredTransactions.length > 0 &&
        filteredTransactions.map((transaction) => (
          <Card
            key={transaction.id}
            className={`${classes.card} ${classes.transactionCard}`}
          >
            <CardContent className={classes.transactionDetails}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='h6'
                  component='h2'
                >
                  {getTransactionIcon(transaction.type)}
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Typography>
                <Typography
                  color='textSecondary'>
                  Date: {formatDate(transaction.createdAt)}
                </Typography>
                <Typography
                  color='textSecondary'>
                  Fee: {transaction.fee}
                </Typography>
                <Typography
                  color='textSecondary'>
                  Exchange Rate: {transaction.exchangeRate}
                </Typography>
                <Typography
                  color='textSecondary'
                  className={classes.transactionStatus}
                >
                  Status: {transaction.status}
                </Typography>
                <Typography color='textSecondary'>
                  Channel: {transaction.channel}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant='h6'
                  className={classes.transactionAmount}>
                  <MonetizationOnIcon
                    className={classes.icon}
                    color='action' />
                  Amount: {transaction.amount} {transaction.currency}
                </Typography>
                {transaction.sourceTransactionAccount && (
                  <Chip
                    label={`From: ${transaction.sourceTransactionAccount.accountNumber}`}
                    className={classes.chip}
                  />
                )}
                {transaction.destinationTransactionAccount && (
                  <Chip
                    label={`To: ${transaction.destinationTransactionAccount.accountNumber}`}
                    className={classes.chip}
                  />
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
    </Container>
  );
};

export default Transactions;
