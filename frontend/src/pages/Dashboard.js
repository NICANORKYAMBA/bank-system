import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchAccounts } from '../hooks/useFetchAccounts';
import { useSelectedAccount } from '../hooks/useSelectedAccount';
import {
  setSelectedAccount,
  setError,
  setShowTransferForm,
  setShowWithdrawalForm,
  setShowDepositForm,
  setSearchTerm,
  setSearchCategory,
  fetchAllAccountsDataThunk,
  fetchSelectedAccountDataThunk
} from '../redux/actions/DashboardActions';

import {
  CircularProgress,
  Snackbar,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  makeStyles
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';

import DashboardHeader from '../components/DashboardHeader';
import AccountsList from '../components/AccountList';
import AccountSummary from '../components/AccountSummary';
import TransactionsList from '../components/TransactionsList';
import QuickActions from '../components/QuickActions';
import GraphsAndCharts from '../components/GraphsAndCharts';

const useDashboardStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  },
  dashboardContainer: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(-8),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 'calc(100% - ' + theme.spacing(2) + 'px)',
    margin: 'auto'
  },
  dashboardButton: {
    textTransform: 'none',
    margin: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  dashboardCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  dashboardCardIcon: {
    fontSize: '4rem',
    color: theme.palette.primary.main
  },
  dashboardCardTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  dashboardCardSubtitle: {
    color: theme.palette.grey[600]
  },
  dashboardCardLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  dashboardCardButton: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    },
    color: '#fff',
    fontWeight: 'bold'
  },
  dashboardCardButtonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  dashboardCardButtonLink: {
    textDecoration: 'none',
    color: '#fff'
  },
  dashboardCardButtonIcon: {
    marginRight: theme.spacing(1)
  },
  dashboardCardButtonLabel: {
    textTransform: 'none'
  },
  dashboardCardButtonProgress: {
    color: '#fff',
    marginRight: theme.spacing(1)
  },
  dashboardCardButtonSuccess: {
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  dashboardCardButtonError: {
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  dashboardCardButtonWarning: {
    backgroundColor: theme.palette.warning.main,
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  },
  dashboardCardButtonInfo: {
    backgroundColor: theme.palette.info.main,
    '&:hover': {
      backgroundColor: theme.palette.info.dark
    }
  },
  dashboardCardButtonPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  dashboardCardButtonPaperIcon: {
    fontSize: '4rem',
    color: theme.palette.primary.main
  },
  dashboardCardButtonPaperTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main
  }
}));

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Dashboard ({ reload, onTransactionCreated }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;
  const shouldAdjustForDrawer = !isMobile;
  const classes = useDashboardStyles({ drawerWidth, shouldAdjustForDrawer });
  const history = useHistory();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.loginForm.userData || {});
  const dashboardState = useSelector(state => state.dashboard);

  const {
    selectedAccount = {},
    selectedAccountData = {},
    accountsData = [],
    loading = false,
    error = null,
    transactions = [],
    showTransferForm = false,
    showWithdrawalForm = false,
    showDepositForm = false,
    searchCategory = ''
  } = dashboardState;

  useEffect(() => {
    if (!userData.userId || !userData.firstName || !userData.lastName) {
      history.push('/login');
    }
  }, [userData, history]);

  useFetchAccounts(userData.userId);
  useSelectedAccount(dashboardState.selectedAccount);

  const transactionsScrollContainerRef = useRef(null);

  const scrollTransactions = (scrollOffset) => {
    transactionsScrollContainerRef.current.scrollLeft += scrollOffset;
  };

  const handleTransferClick = () => {
    dispatch(setShowTransferForm(true));
  };

  const handleClose = () => {
    dispatch(setShowTransferForm(false));
    if (onTransactionCreated) onTransactionCreated();
  };

  const handleWithdrawalClick = () => {
    dispatch(setShowWithdrawalForm(true));
  };

  const handleCloseWithdrawal = () => {
    dispatch(setShowWithdrawalForm(false));
    if (onTransactionCreated) onTransactionCreated();
  };

  const handleDepositClick = () => {
    dispatch(setShowDepositForm(true));
  };

  const handleCloseDeposit = () => {
    dispatch(setShowDepositForm(false));
    if (onTransactionCreated) onTransactionCreated();
  };

  const handleTransactionCreated = () => {
    if (selectedAccount) {
      dispatch(fetchSelectedAccountDataThunk(selectedAccount.id));
      dispatch(fetchAllAccountsDataThunk());
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const refreshAccounts = () => {
    dispatch(fetchAllAccountsDataThunk(userData.userId));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log(`Searching transactions for: ${dashboardState.searchTerm}`);
    // Perform search logic here
  };

  return (
    <div className={classes.root}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      {!loading && error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity='error'>{error}</Alert>
        </Snackbar>
      )}
      {!loading && !error && (
        <>
          <Container
            className={classes.dashboardContainer}
            style={{
              paddingLeft: shouldAdjustForDrawer ? theme.spacing(3) + drawerWidth : theme.spacing(3),
              paddingRight: theme.spacing(3),
              transition: theme.transitions.create(['padding-left'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
              })
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DashboardHeader
                  handleSearchChange={handleSearchChange}
                  handleSearchSubmit={handleSearchSubmit}
                  userData={userData}
                  searchCategory={searchCategory}
                  handleSearchCategoryChange={
                    (event) => setSearchCategory(event.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <AccountsList
                  classes={classes}
                  accountsData={accountsData}
                  setSelectedAccount={setSelectedAccount}
                  refreshAccounts={refreshAccounts}
                />
              </Grid>

              <Grid item xs={12} sm={8} md={6}>
                <AccountSummary
                  classes={classes}
                  selectedAccount={selectedAccountData}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={6}>
                <TransactionsList
                  classes={classes}
                  transactions={transactions}
                  selectedAccount={selectedAccount}
                  scrollTransactions={scrollTransactions}
                  transactionsScrollContainerRef={transactionsScrollContainerRef}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={6}>
                <QuickActions
                  classes={classes}
                  accountsData={accountsData}
                  handleDepositClick={handleDepositClick}
                  handleTransferClick={handleTransferClick}
                  handleWithdrawalClick={handleWithdrawalClick}
                  showDepositForm={showDepositForm}
                  showTransferForm={showTransferForm}
                  showWithdrawalForm={showWithdrawalForm}
                  handleCloseDeposit={handleCloseDeposit}
                  handleClose={handleClose}
                  handleCloseWithdrawal={handleCloseWithdrawal}
                  onTransactionCreated={handleTransactionCreated}
                />
              </Grid>
              <Grid item xs={12}>
                <GraphsAndCharts classes={classes} />
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </div>
  );
}

export default Dashboard;
