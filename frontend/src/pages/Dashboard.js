import React, { useState, useEffect, useRef } from 'react';
import {
  CircularProgress,
  Snackbar,
  Container,
  Grid
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useStyles } from '../styles/dashboardStyles';
import { fetchAccount, fetchAccounts, fetchTransactions } from '../api/api';

import DashboardHeader from '../components/DashboardHeader';
import AccountsList from '../components/AccountList';
import AccountSummary from '../components/AccountSummary';
import TransactionsList from '../components/TransactionsList';
import QuickActions from '../components/QuickActions';
import GraphsAndCharts from '../components/GraphsAndCharts';

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Dashboard ({ reload, onTransactionCreated }) {
  const classes = useStyles();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleProfilePopoverOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setProfileAnchorEl(null);
  };

  const userData = useState({
    firstName: sessionStorage.getItem('firstName'),
    lastName: sessionStorage.getItem('lastName')
  })[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('userId');

        let accountsData = [];
        try {
          accountsData = await fetchAccounts(userId);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log('No accounts found for this user.');
            accountsData = [];
            console.log(accountsData);
          } else {
            throw error;
          }
        }
        const transactionsData = await fetchTransactions(userId);

        setAccountsData(accountsData);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching data');
        setLoading(false);
      }
      if (selectedAccount) {
        const selectedAccountData = await fetchAccount(selectedAccount.id);
        setSelectedAccountData(selectedAccountData);
      }
    };

    fetchData();
  }, [reload, selectedAccount]);

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

  const [showTransferForm, setShowTransferForm] = useState(false);

  const handleTransferClick = () => {
    setShowTransferForm(true);
  };

  const handleClose = () => {
    setShowTransferForm(false);
    onTransactionCreated();
  };

  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const handleWithdrawalClick = () => {
    setShowWithdrawalForm(true);
  };

  const handleCloseWithdrawal = () => {
    setShowWithdrawalForm(false);
    onTransactionCreated();
  };

  const [showDepositForm, setShowDepositForm] = useState(false);

  const handleDepositClick = () => {
    setShowDepositForm(true);
  };

  const handleCloseDeposit = () => {
    setShowDepositForm(false);
    onTransactionCreated();
  };

  const handleTransactionCreated = () => {
    onTransactionCreated();
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
                <AccountSummary classes={classes} selectedAccount={selectedAccountData} />
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
