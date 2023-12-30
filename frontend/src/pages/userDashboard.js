import React from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  AppBar,
  TextField,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  Menu,
  Badge,
  MenuItem,
  Popover
  , Avatar
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';
import BillIcon from '@material-ui/icons/Receipt';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    marginBottom: theme.spacing(3),
    height: '50%',
    width: '100%',
    backgroundColor: theme.palette.primary.main
  },
  title: {
    fontWeight: 600,
    fontSize: '1.5rem'
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240,
    backgroundColor: theme.palette.grey[200]
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  card: {
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.grey[100]
  },
  cardContent: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  },
  dashboardContainer: {
    marginTop: theme.spacing(3)
  },
  dashboardButton: {
    margin: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  dashboardCard: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  accountsCard: {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    padding: theme.spacing(2)
  },
  accountsTitle: {
    marginBottom: theme.spacing(2),
    color: '#1976D2'
  },
  accountCard: {
    marginBottom: theme.spacing(2),
    cursor: 'pointer'
  },
  accountName: {
    fontWeight: 'bold'
  },
  summaryCard: {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    padding: theme.spacing(2)
  },
  summaryTitle: {
    marginBottom: theme.spacing(2),
    color: '#1976D2'
  },
  summaryDetail: {
    marginBottom: theme.spacing(1)
  }
}));

function Dashboard () {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

  const handleProfilePopoverOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfilePopoverClose = () => {
    setProfileAnchorEl(null);
  };

  const profileOpen = Boolean(profileAnchorEl);

  React.useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [accountsData, setAccountsData] = React.useState(null);

  React.useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    axios.get(`http://localhost:5000/api/accounts/user/${userId}`, {
      params: {
        limit: 10,
        offset: 0,
        sort: 'createdAt',
        order: 'DESC'
      }
    })
      .then(response => {
        setAccountsData(response.data.accounts);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const userData = React.useState({
    firstName: sessionStorage.getItem('firstName'),
    lastName: sessionStorage.getItem('lastName')
  })[0];

  return (
    <div className={classes.root}>
      <Hidden smUp implementation='css'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div>
            <IconButton onClick={handleDrawerClose}>
              <Typography variant='h6'>
                General
              </Typography>
              <Link component='button' variant='body2' onClick={() => { console.log('Profile Management clicked'); }}>
                Profile Management
              </Link>
              <Button color='inherit' startIcon={<ExitToAppIcon />}>
                Logout
              </Button>
            </IconButton>
          </div>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <AppBar position='static' className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-around' style={{ height: '100%' }}>
              <Typography variant='h6' className={classes.title}>
                General
              </Typography>
              <IconButton
                edge='end'
                aria-label='help'
                color='inherit'
                onClick={() => { console.log('Help clicked'); }}
              >
                <HelpOutlineIcon />
              </IconButton>
              <Link component='button' variant='body2' onClick={() => { console.log('Contact Information clicked'); }} style={{ color: '#fff' }}>
                Contact Information
              </Link>
            </Box>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              onClick={handleMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile Management</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Hidden>
      <Container className={classes.dashboardContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant='h4' component='h1' gutterBottom style={{ marginLeft: '20px' }}>
              Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' justifyContent='flex-end' alignItems='center' style={{ marginLeft: '20px' }}>
              <TextField
                variant='outlined'
                placeholder='Search transactions'
                InputProps={{
                  startAdornment: <SearchIcon />
                }}
              />
              <Button variant='contained' color='primary' className={classes.button}>
                Filter
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              <IconButton color='inherit'>
                <Badge badgeContent={4} color='secondary'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge='end'
                aria-label='user profile'
                color='inherit'
                onClick={handleProfilePopoverOpen}
              >
                <Avatar alt='User Profile' src='https://via.placeholder.com/150' />
              </IconButton>
              <Popover
                id='profile-popover'
                open={profileOpen}
                anchorEl={profileAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                onClose={handleProfilePopoverClose}
                disableRestoreFocus
              >
                <Typography>
                  User details go here
                </Typography>
              </Popover>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={`${classes.dashboardCard} ${classes.accountsCard}`}>
              <CardContent className={classes.dashboardCardContent}>
                <Typography variant='h6' component='h2' gutterBottom className={classes.accountsTitle}>
                  Accounts
                </Typography>
                {accountsData
                  ? (
                      accountsData.map((account, index) => (
                        <Card key={index} variant='outlined' className={classes.accountCard} onClick={() => setSelectedAccount(account)}>
                          <CardContent>
                            <Typography variant='h5' component='h2' className={classes.accountName}>
                              {account.name}
                            </Typography>
                            <Typography color='textSecondary'>
                              Balance: {account.balance}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))
                    )
                  : (
                    <Typography color='textSecondary'>
                      Loading accounts...
                    </Typography>
                    )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={`${classes.dashboardCard} ${classes.summaryCard}`}>
              <CardContent className={classes.dashboardCardContent}>
                <Typography variant='h6' component='h2' gutterBottom className={classes.summaryTitle}>
                  Account Summary
                </Typography>
                {selectedAccount
                  ? (
                    <>
                      <Typography className={classes.summaryDetail}>
                        <strong>Account Number:</strong> {selectedAccount.accountNumber}
                      </Typography>
                      <Typography className={classes.summaryDetail}>
                        <strong>Name:</strong> {selectedAccount.name}
                      </Typography>
                      <Typography className={classes.summaryDetail} style={{ color: selectedAccount.balance < 0 ? 'red' : 'green' }}>
                        <strong>Balance:</strong> {selectedAccount.balance}
                      </Typography>
                      <Typography className={classes.summaryDetail}>
                        <strong>Account Type:</strong> {selectedAccount.accountType}
                      </Typography>
                      <Typography className={classes.summaryDetail}>
                        <strong>Currency:</strong> {selectedAccount.currency}
                      </Typography>
                      <Typography className={classes.summaryDetail} style={{ color: selectedAccount.status === 'active' ? 'green' : 'red' }}>
                        <strong>Status:</strong> {selectedAccount.status}
                      </Typography>
                    </>
                    )
                  : (
                    <Typography color='textSecondary'>
                      Click an account to see its summary.
                    </Typography>
                    )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.dashboardCard}>
              <CardContent className={classes.dashboardCardContent}>
                <Typography variant='h6' component='h2' gutterBottom>
                  Transactions
                </Typography>
                {/* Transactions list goes here */}
                <Typography color='textSecondary'>
                  A list of transactions will be displayed here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.dashboardCard}>
              <CardContent className={classes.dashboardCardContent}>
                <Typography variant='h6' component='h2' gutterBottom>
                  Quick Actions
                </Typography>
                {/* Quick actions go here */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<DepositIcon />}
                      className={`${classes.dashboardButton} ${classes.depositButton}`}
                    >
                      Make a Deposit
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='secondary'
                      startIcon={<TransferIcon />}
                      className={`${classes.dashboardButton} ${classes.transferButton}`}
                    >
                      Initiate a Transfer
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='default'
                      startIcon={<WithdrawIcon />}
                      className={`${classes.dashboardButton} ${classes.withdrawButton}`}
                    >
                      Make a Withdrawal
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='inherit'
                      startIcon={<BillIcon />}
                      className={`${classes.dashboardButton} ${classes.billButton}`}
                    >
                      Pay a Bill
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className={classes.dashboardCard}>
              <CardContent className={classes.dashboardCardContent}>
                <Typography variant='h6' component='h2' gutterBottom>
                  Graphs and Charts
                </Typography>
                {/* Graphs and charts go here */}
                <Typography color='textSecondary'>
                  Graphs and charts will be displayed here.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
