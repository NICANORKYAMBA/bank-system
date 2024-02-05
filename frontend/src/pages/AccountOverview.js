import React, { useState, useEffect, useMemo } from 'react';
import { fetchAccounts, updateAccountsName } from '../api/api';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserId } from '../redux/selectors/userSelectors';
import {
  CircularProgress,
  Typography,
  Container,
  Paper,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Snackbar,
  Button,
  Grid,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  DialogTitle,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CreateAccountForm from '../components/CreateAccountForm';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(-16),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(30),
    marginRight: 'auto',
    maxWidth: `calc(100% - ${theme.spacing(30)}px)`,
    boxSizing: 'border-box'
  },
  paper: {
    padding: theme.spacing(4),
    margin: theme.spacing(2, 0),
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius
  },
  header: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    position: 'relative',
    '&::after': {
      content: '""',
      display: 'block',
      width: '50%',
      height: '4px',
      backgroundColor: theme.palette.secondary.main,
      position: 'absolute',
      bottom: '-8px',
      left: '0'
    }
  },
  listItem: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  list: {
    width: '100%'
  },
  errorText: {
    color: theme.palette.error.main
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh'
  },
  listItemAvatar: {
    color: theme.palette.primary.main
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh'
  },
  errorBox: {
    textAlign: 'center',
    marginTop: theme.spacing(4)
  },
  primaryText: {
    color: theme.palette.primary.dark,
    fontWeight: 600,
    display: 'block',
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5)
  },
  secondaryText: {
    color: theme.palette.secondary.dark,
    fontSize: '0.875rem'
  },
  listItemText: {
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  noAccountsContainer: {
    textAlign: 'center',
    padding: theme.spacing(4)
  },
  noAccountsFullContainer: {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noAccountsHeader: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600
  },
  noAccountsMessage: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary
  },
  createAccountButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  searchField: {
    marginBottom: theme.spacing(3)
  },
  actionButton: {
    marginLeft: theme.spacing(4)
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2)
  }
}));

const handleError = (err) => {
  let errorMessage = '';
  switch (err.response?.status) {
    case 404:
      errorMessage = 'User not found';
      break;
    case 500:
      errorMessage = 'Server error';
      break;
    default:
      errorMessage = err.message;
  }
  return errorMessage;
};

const AccountOverview = () => {
  const classes = useStyles();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCreateAccountDialog, setOpenCreateAccountDialog] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const userId = useSelector(getUserId);

  const handleOpenUpdateDialog = (account) => {
    setCurrentAccount(account);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setCurrentAccount(null);
  };

  const updateAccountName = async () => {
    if (!currentAccount || !currentAccount.accountNumber || !currentAccount.name) {
      setSnackbarMessage('Invalid account details');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await updateAccountsName(
        currentAccount.accountNumber,
        currentAccount.name
      );
      setAccounts(accounts.map(account =>
        account.accountNumber === currentAccount.accountNumber
          ? {
              ...account, name: currentAccount.name
            }
          : account));
      handleCloseUpdateDialog();
      setSnackbarMessage('Account name updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error updating account name: ' + error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenCreateAccountDialog = () => {
    setOpenCreateAccountDialog(true);
  };

  const handleCloseCreateAccountDialog = () => {
    setOpenCreateAccountDialog(false);
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  useEffect(() => {
    fetchAccounts(userId)
      .then(response => {
        setAccounts(response);
        setHasFetched(true);
        setLoading(false);
      })
      .catch(err => {
        const errorMessage = handleError(err);
        setError(errorMessage);
        setOpen(true);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Box className={classes.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Box className={classes.errorBox}>
          <Typography variant='h6' color='error'>
            Error: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  const fetchAndUpdateAccounts = () => {
    fetchAccounts(userId)
      .then(response => {
        setAccounts(response);
      })
      .catch(err => {
        const errorMessage = handleError(err);
        setError(errorMessage);
        setOpen(true);
      });
  };

  if (hasFetched && accounts.length === 0) {
    return (
      <Container className={classes.container}>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          className={classes.noAccountsFullContainer}
        >
          <Grid item>
            <Paper className={classes.paper}>
              <Box className={classes.noAccountsContainer}>
                <Typography
                  variant='h4'
                  gutterBottom className={classes.noAccountsHeader}>
                  Welcome to FinTrust Account Overview Page!
                </Typography>
                <Typography
                  variant='h6'
                  className={classes.noAccountsMessage}>
                  You currently have no accounts.
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateAccountDialog}
                  className={classes.createAccountButton}
                >
                  Create Your First Account
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={openCreateAccountDialog}
          onClose={handleCloseCreateAccountDialog}
        >
          <DialogContent>
            <CreateAccountForm onAccountCreated={() => {
              handleCloseCreateAccountDialog();
              fetchAndUpdateAccounts();
            }}
            />
          </DialogContent>
        </Dialog>
      </Container>
    );
  }

  return (
    <>
      {loading && (
        <Box className={classes.loadingBox}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={() => setOpen(false)} severity='error'>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Container className={classes.container}>
        <Paper className={classes.paper}>
          <Typography
            variant='h4'
            gutterBottom className={classes.header}
          >
            Accounts Overview
          </Typography>
          <TextField
            label='Search Accounts'
            variant='outlined'
            fullWidth
            margin='normal'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.searchField}
          />
          <List className={classes.list}>
            {filteredAccounts.map((account) => (
              <ListItem
                key={account.id}
                className={classes.listItem}
              >
                <ListItemAvatar>
                  <Avatar className={classes.listItemAvatar}>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span className={classes.primaryText}>
                      {`Account Number: ${account.accountNumber}`}
                    </span>
                  }
                  secondary={
                    <>
                      <span className={classes.primaryText}>
                        {`Account Name: ${account.name}`}
                      </span>
                      <span className={classes.secondaryText}>
                        {`Balance: ${account.balance}`}
                      </span>
                    </>
                  }
                  className={classes.listItemText}
                />
                <IconButton
                  edge='end'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  component={Link}
                  to={`/account-overview/${account.id}`}
                  color='secondary'
                >
                  <VisibilityIcon />
                </IconButton>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenUpdateDialog(account);
                  }}
                  color='secondary'
                  variant='contained'
                  size='small'
                  startIcon={<EditIcon />}
                  className={classes.actionButton}
                >
                  Update Name
                </Button>
              </ListItem>
            ))}
          </List>
          <Dialog
            open={openUpdateDialog}
            onClose={handleCloseUpdateDialog}
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle
              id='form-dialog-title'
              className={classes.dialogTitle}
            >
              Update Account Name
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To update the account name, please enter the new name below.
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='New Account Name'
                type='text'
                fullWidth
                value={currentAccount?.name || ''}
                onChange={(e) => setCurrentAccount({
                  ...currentAccount, name: e.target.value
                })}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseUpdateDialog}
                color='secondary'
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateAccountName()}
                color='primary'
                variant='contained'
                startIcon={<SaveIcon />}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </>
  );
};

export default AccountOverview;
