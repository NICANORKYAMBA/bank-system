import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllAccountsDataThunk,
  fetchSelectedAccountDataThunk,
  setError
} from '../redux/actions/userActions';

import {
  getUserId,
  getUserFirstName,
  getUserLastName,
  getUserSelectedAccount,
  getUserAccountsData,
  getUserTransactions
} from '../redux/selectors/userSelectors';

import {
  setSearchTerm,
  setSearchCategory
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
  },
  selectedTableRow: {
    backgroundColor: theme.palette.success.light
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
  const classes = useDashboardStyles({
    drawerWidth,
    shouldAdjustForDrawer
  });
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = useSelector(getUserId);
  const firstName = useSelector(getUserFirstName);
  const lastName = useSelector(getUserLastName);
  const selectedAccount = useSelector(getUserSelectedAccount);
  const transactions = useSelector(getUserTransactions);
  const accountsData = useSelector(getUserAccountsData);

  const prevUserIdRef = useRef();
  useEffect(() => {
    prevUserIdRef.current = userId;
  });
  const prevUserId = prevUserIdRef.current;

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAccountsDataThunk(userId));
    } else if (prevUserId !== undefined && prevUserId !== userId) {
      history.push('/login');
    }
  }, [userId, dispatch, history, prevUserId]);

  const handleAccountClick = (account) => {
    dispatch(fetchSelectedAccountDataThunk(account.id));
  };

  const refreshAccounts = () => {
    if (userId) {
      dispatch(fetchAllAccountsDataThunk(userId));
    }
  };

  const loading = useSelector(state => state.dashboard.loading);
  const error = useSelector(state => state.dashboard.error);
  const searchCategory = useSelector(state => state.dashboard.searchCategory);

  const transactionsScrollContainerRef = useRef(null);

  const scrollTransactions = (scrollOffset) => {
    transactionsScrollContainerRef.current.scrollLeft += scrollOffset;
  };

  const handleTransactionCreated = () => {
    if (userId) {
      dispatch(fetchAllAccountsDataThunk(userId));

      if (selectedAccount) {
        dispatch(fetchSelectedAccountDataThunk(selectedAccount.id));
      }
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log(`Searching transactions for: ${searchCategory}`);
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
              paddingLeft: shouldAdjustForDrawer
                ? theme.spacing(3) + drawerWidth
                : theme.spacing(3),
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
                  userData={{ firstName, lastName }}
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
                  setSelectedAccount={handleAccountClick}
                  refreshAccounts={refreshAccounts}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <AccountSummary
                  classes={classes}
                  selectedAccount={selectedAccount}
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
