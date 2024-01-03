import React, { useState, useEffect, useRef } from 'react';
import {
  CircularProgress,
  Snackbar,
  Container,
  Grid
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useStyles } from '../styles/dashboardStyles';
import { fetchAccounts, fetchTransactions } from '../api/api';
import { useDashboard } from '../api/useDashboard';

import Navigation from '../components/Navigation';
import DashboardHeader from '../components/DashboardHeader';
import AccountsList from '../components/AccountList';
import AccountSummary from '../components/AccountSummary';
import TransactionsList from '../components/TransactionsList';
import QuickActions from '../components/QuickActions';
import GraphsAndCharts from '../components/GraphsAndCharts';

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Dashboard () {
  const classes = useStyles();

  const {
    anchorEl,
    handleMenuOpen,
    handleMenuClose,
    handleDrawerOpen,
    handleDrawerClose,
    open
  } = useDashboard();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleProfilePopoverOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setProfileAnchorEl(null);
  };

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountsData, setAccountsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = useState({
    firstName: sessionStorage.getItem('firstName'),
    lastName: sessionStorage.getItem('lastName')
  })[0];

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const accountsData = await fetchAccounts(userId);
        const transactionsData = await fetchTransactions(userId);

        setAccountsData(accountsData);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const accountsScrollContainerRef = useRef(null);
  const transactionsScrollContainerRef = useRef(null);

  const scrollAccounts = (scrollOffset) => {
    accountsScrollContainerRef.current.scrollLeft += scrollOffset;
  };

  const scrollTransactions = (scrollOffset) => {
    transactionsScrollContainerRef.current.scrollLeft += scrollOffset;
  };

  const [showTransferForm, setShowTransferForm] = useState(false);

  const handleTransferClick = () => {
    setShowTransferForm(true);
  };

  const handleClose = () => {
    setShowTransferForm(false);
  };

  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const handleWithdrawalClick = () => {
    setShowWithdrawalForm(true);
  };

  const handleCloseWithdrawal = () => {
    setShowWithdrawalForm(false);
  };

  const [showDepositForm, setShowDepositForm] = useState(false);

  const handleDepositClick = () => {
    setShowDepositForm(true);
  };

  const handleCloseDeposit = () => {
    setShowDepositForm(false);
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
          <Navigation
            classes={classes}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            anchorEl={anchorEl}
            open={open}
          />
          <Container className={classes.dashboardContainer} style={{ maxWidth: '1060px' }}>
            <Grid container spacing={3}>
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
              <Grid item xs={12} md={6}>
                <AccountsList
                  classes={classes}
                  accountsData={accountsData}
                  setSelectedAccount={setSelectedAccount}
                  scrollAccounts={scrollAccounts}
                  accountsScrollContainerRef={accountsScrollContainerRef}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AccountSummary classes={classes} selectedAccount={selectedAccount} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TransactionsList
                  classes={classes}
                  transactions={transactions}
                  scrollTransactions={scrollTransactions}
                  transactionsScrollContainerRef={transactionsScrollContainerRef}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <QuickActions
                  classes={classes}
                  handleDepositClick={handleDepositClick}
                  handleTransferClick={handleTransferClick}
                  handleWithdrawalClick={handleWithdrawalClick}
                  showDepositForm={showDepositForm}
                  showTransferForm={showTransferForm}
                  showWithdrawalForm={showWithdrawalForm}
                  handleCloseDeposit={handleCloseDeposit}
                  handleClose={handleClose}
                  handleCloseWithdrawal={handleCloseWithdrawal}
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
