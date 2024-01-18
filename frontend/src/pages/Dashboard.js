import React, { useState, useEffect, useRef } from 'react';
import {
  CircularProgress,
  Snackbar,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  makeStyles
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {
  fetchAccount,
  fetchAccounts,
  fetchTransactionsByAccountId
} from '../api/api';

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

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);

  const handleProfilePopoverOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setProfileAnchorEl(null);
  };

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    const storedFirstName = sessionStorage.getItem('firstName');
    const storedLastName = sessionStorage.getItem('lastName');
    if (storedFirstName && storedLastName) {
      setUserData({
        firstName: storedFirstName,
        lastName: storedLastName
      });
    }
  }, []);

  const fetchAllAccountsData = async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      const accountsData = await fetchAccounts(userId);
      setAccountsData(accountsData);
    } catch (error) {
      console.error(error);
      setError('Error fetching all accounts data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAccountsData();
  }, []);

  useEffect(() => {
    const fetchSelectedAccountData = async () => {
      if (selectedAccount) {
        try {
          const transactionsData = await fetchTransactionsByAccountId(selectedAccount.id);
          setTransactions(transactionsData);

          const AccountData = await fetchAccount(selectedAccount.id);
          setSelectedAccountData(AccountData);
        } catch (error) {
          console.error(error);
          setError('Error fetching data for selected account');
        }
      }
    };

    fetchSelectedAccountData();
  }, [selectedAccount]);

  const accountsScrollContainerRef = useRef(null);
  const transactionsScrollContainerRef = useRef(null);

  const scrollAccounts = (scrollOffset) => {
    if (accountsScrollContainerRef.current) {
      accountsScrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  const scrollTransactions = (scrollOffset) => {
    transactionsScrollContainerRef.current.scrollLeft += scrollOffset;
  };

  const handleTransferClick = () => {
    setShowTransferForm(true);
  };

  const handleClose = () => {
    setShowTransferForm(false);
    onTransactionCreated();
  };

  const handleWithdrawalClick = () => {
    setShowWithdrawalForm(true);
  };

  const handleCloseWithdrawal = () => {
    setShowWithdrawalForm(false);
    onTransactionCreated();
  };

  const handleDepositClick = () => {
    setShowDepositForm(true);
  };

  const handleCloseDeposit = () => {
    setShowDepositForm(false);
    onTransactionCreated();
  };

  const handleTransactionCreated = async () => {
    try {
      const transactionsData = await fetchTransactionsByAccountId(selectedAccount.id);
      setTransactions(transactionsData);

      const accountData = await fetchAccount(selectedAccount.id);
      setSelectedAccountData(accountData);

      await fetchAllAccountsData();
    } catch (error) {
      console.error(error);
      setError('Error fetching data after transaction');
    }

    setShowTransferForm(false);
    setShowWithdrawalForm(false);
    setShowDepositForm(false);

    if (onTransactionCreated) {
      onTransactionCreated();
    }
  };

  const profileOpen = Boolean(profileAnchorEl);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Perform the search using the searchTerm
    console.log(`Searching transactions for: ${searchTerm}`);
  // This could involve calling an API and updating your state with the results
  };

  const notificationsCount = 4;

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
                  classes={classes}
                  userData={userData}
                  handleProfilePopoverOpen={handleProfilePopoverOpen}
                  profileOpen={profileOpen}
                  profileAnchorEl={profileAnchorEl}
                  handleProfilePopoverClose={handleProfilePopoverClose}
                  handleSearchChange={handleSearchChange}
                  handleSearchSubmit={handleSearchSubmit}
                  notificationsCount={notificationsCount}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <AccountsList
                  classes={classes}
                  accountsData={accountsData}
                  setSelectedAccount={setSelectedAccount}
                  scrollAccounts={scrollAccounts}
                  accountsScrollContainerRef={accountsScrollContainerRef}
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
