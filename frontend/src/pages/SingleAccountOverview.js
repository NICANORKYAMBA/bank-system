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
  Card,
  CardContent,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
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

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(3),
    maxWidth: 800,
    width: '100%',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflow: 'auto'
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
    position: 'absolute',
    olor: theme.palette.primary.contrastText,
    right: theme.spacing(2),
    top: theme.spacing(2)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius
  },
  headerContent: {
    flexGrow: 1
  },
  headerIcon: {
    display: 'flex',
    marginRight: theme.spacing(2),
    fontSize: '3rem'
  },
  gridItem: {
    padding: theme.spacing(1)
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error'>
          Error: {error}
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
            <IconButton onClick={handleRefresh} className={classes.refreshButton}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Card className={classes.card}>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PermIdentityIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Account Number' secondary={account.accountNumber} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonOutlineIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Account Name' secondary={account.name} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Account Type' secondary={account.accountType} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MonetizationOnIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Balance' secondary={account.balance} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EuroSymbolIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Currency' secondary={account.currency} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Status' secondary={account.status} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DateRangeIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary='Date of Creation' secondary={new Date(account.createdAt).toLocaleDateString()} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default SingleAccountOverview;
