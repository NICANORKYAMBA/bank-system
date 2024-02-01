import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Paper,
  CircularProgress,
  InputAdornment,
  FormControl,
  OutlinedInput
} from '@material-ui/core';
import {
  fetchAllAccountsDataThunk
} from '../redux/actions/QuickActions';
import MuiAlert from '@material-ui/lab/Alert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Description from '@material-ui/icons/Description';
import * as ReactSpring from 'react-spring';
import axios from 'axios';
import { getUserId } from '../redux/selectors/userSelectors';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s'
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 400,
    maxWidth: 490,
    '& label.Mui-focused': {
      color: '#1976D2',
      fontSize: '1rem'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1976D2'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1976D2'
      }
    }
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
    marginLeft: theme.spacing(0),
    borderRadius: '5px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  formButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 300,
    backgroundColor: '#1976D2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#135895'
    },
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  title: {
    marginBottom: theme.spacing(2),
    color: '#1976D2',
    fontSize: '2rem'
  }
}));

const DepositForm = ({ handleClose, onTransactionCreated }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    sourceAccountNumber: '',
    description: ''
  });

  const accounts = useSelector(state => state.quick.accountsData);
  const userId = useSelector(getUserId);

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    dispatch(fetchAllAccountsDataThunk(userId));
  }, [userId, dispatch]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.amount) {
      setSnackbarMessage('Please fill in the Amount Field.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    } else if (!formData.sourceAccountNumber) {
      setSnackbarMessage('Please fill in a Source Account Number.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    const data = {
      ...formData,
      userId
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:5000/api/transactions', data);
      setSnackbarMessage('Deposit successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onTransactionCreated();
      setTimeout(() => {
        handleClose();
      }, 6000);
    } catch (error) {
      setSnackbarMessage('Failed to make a deposit.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const props = ReactSpring.useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <ReactSpring.animated.div style={props}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Paper className={classes.paper} elevation={3}>
        <Typography className={classes.title} variant='h4'>
          Deposit Funds
        </Typography>
        <form
          className={classes.form}
          noValidate autoComplete='off'
          onSubmit={handleSubmit}
        >
          <Grid
            container spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='amount'
                  name='amount'
                  type='number'
                  value={formData.amount}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment
                      position='start'
                    >
                      <MonetizationOn />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Amount'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <InputLabel
                  htmlFor='source-account-number'
                >
                  Source Account Number *
                </InputLabel>
                <Select
                  value={formData.sourceAccountNumber}
                  onChange={handleChange}
                  label='Source Account Number *'
                  inputProps={{
                    name: 'sourceAccountNumber',
                    id: 'source-account-number'
                  }}
                  startAdornment={
                    <InputAdornment
                      position='start'
                    >
                      <AccountCircle />
                    </InputAdornment>
                  }
                >
                  {accounts.map((account) => (
                    <MenuItem
                      key={account.id}
                      value={account.accountNumber}
                      disabled={account.status === 'inactive'}
                    >
                      {account.accountNumber} ({account.status})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='description'
                  name='description'
                  type='text'
                  value={formData.description}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment
                      position='start'
                    >
                      <Description />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Description'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.formButton}
                variant='contained'
                color='primary'
                type='submit'
                disabled={accounts.length === 0 || loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color='inherit' /> : null}
              >
                {loading ? 'Processing...' : 'Deposit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ReactSpring.animated.div>
  );
};

export default DepositForm;
