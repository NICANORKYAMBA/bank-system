import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAccount } from '../api/api';
import {
  CircularProgress,
  Typography,
  Container,
  Paper,
  makeStyles,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid
} from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import RefreshIcon from '@material-ui/icons/Refresh';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: theme.spacing(30),
    marginTop: theme.spacing(-8),
    maxWidth: `calc(100% - ${theme.spacing(30)}px)`,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(3),
    width: '100%',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    overflow: 'auto',
    marginBottom: theme.spacing(4)
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorBox: {
    textAlign: 'center',
    marginTop: theme.spacing(4)
  },
  card: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)'
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.info.main
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  },
  refreshButton: {
    color: theme.palette.primary.contrastText,
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0  4px  8px  0 rgba(0,0,0,0.2)'
  },
  gridContainer: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  gridItem: {
    padding: theme.spacing(2)
  },
  headerContent: {
    flexGrow: 1
  },
  headerIcon: {
    display: 'flex',
    marginRight: theme.spacing(2),
    fontSize: '3rem'
  },
  status: {
    fontWeight: 'bold',
    color: theme.palette.success.main
  },
  balance: {
    fontWeight: 'bold',
    color: theme.palette.warning.main
  }
}));

const SingleAccountOverview = () => {
  const classes = useStyles();
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAccount(accountId)
      .then(data => {
        setAccount(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [accountId]);

  const handleRefresh = () => {
    setLoading(true);
    fetchAccount(accountId)
      .then(data => {
        setAccount(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
        <Typography variant='body1' className={classes.typography}>
          Loading account details...
        </Typography>
      </Box>
    );
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (error) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity='error'
        >
          {error}
          <Button
            onClick={handleRefresh} s
            ize='small'
          >Retry
          </Button>
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Box className={classes.header}>
          <AccountBalanceWalletIcon className={classes.headerIcon} />
          <Typography variant='h4' className={classes.headerContent}>
            Account Overview
          </Typography>
          <Tooltip title='Refresh'>
            <IconButton
              onClick={handleRefresh}
              className={classes.refreshButton}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <PermIdentityIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Account Number'
                    secondary={account.accountNumber}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <PersonOutlineIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Account Name'
                    secondary={account.name}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Account Type'
                    secondary={account.accountType}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary='Status' secondary={account.status} />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <MonetizationOnIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Balance'
                    secondary={account.balance}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <EuroSymbolIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText primary='Currency' secondary={account.currency} />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Interest Rate'
                    secondary={account.interestRate}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <CreditCardIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Overdraft Limit'
                    secondary={account.overdraftLimit}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Last Transaction Date'
                    secondary={
                      new Date(account.lastTransactionDate).toLocaleDateString()
                    }
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
            <Card className={classes.card}>
              <CardContent>
                <ListItem>
                  <ListItemIcon>
                    <DateRangeIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Date of Creation'
                    secondary={new Date(account.createdAt).toLocaleDateString()}
                  />
                </ListItem>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SingleAccountOverview;
