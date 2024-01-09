import React, { useEffect, useState } from 'react';
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
  FormControl,
  OutlinedInput,
  CircularProgress,
  InputAdornment
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import MuiAlert from '@material-ui/lab/Alert';
import * as ReactSpring from 'react-spring';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
    borderRadius: '5px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
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
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  inputIcon: {
    marginRight: theme.spacing(1)
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
}));

const TransferForm = ({ handleClose }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    type: 'transfer',
    amount: '',
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    description: ''
  });

  const [accounts, setAccounts] = useState([]);
  const [noAccounts, setNoAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5000/api/accounts/user/${userId}`);
        if (response.data && response.data.accounts.length === 0) {
          setNoAccounts(true);
        } else {
          setAccounts(response.data.accounts);
        }
      } catch (err) {
        console.error('Error fetching accounts: ', err);
        setSnackbarMessage('Failed to fetch accounts.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      ...formData,
      userId: sessionStorage.getItem('userId')
    };

    try {
      const response = await axios.post('http://localhost:5000/api/transactions', data);
      console.log('Transfer initiated successfully: ', response);
      setSnackbarMessage('Transfer initiated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        handleClose();
      }, 6000);
    } catch (error) {
      console.error('Error initiating transfer: ', error);
      setSnackbarMessage('Failed to initiate transfer.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const props = ReactSpring.useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <ReactSpring.animated.div style={props}>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant='filled' onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Paper className={classes.paper} elevation={3}>
        <Typography className={classes.title} variant='h4'>
          Transfer Funds
        </Typography>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {!noAccounts && (
          <form className={classes.form} noValidate autoComplete='off' onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent='center' alignItems='center'>
              <Grid item xs={12}>
                <FormControl variant='outlined' fullWidth className={classes.formControl}>
                  <OutlinedInput
                    id='amount'
                    name='amount'
                    type='number'
                    value={formData.amount}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position='start'><MoneyIcon /></InputAdornment>}
                    labelWidth={0}
                    placeholder='Amount'
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant='outlined' fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='source-account-number'>Source Account Number *</InputLabel>
                  <Select
                    value={formData.sourceAccountNumber}
                    onChange={handleChange}
                    label='Source Account Number *'
                    inputProps={{
                      name: 'sourceAccountNumber',
                      id: 'source-account-number'
                    }}
                    startAdornment={<InputAdornment position='start'><AccountCircle /></InputAdornment>}
                    required
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
                <FormControl variant='outlined' fullWidth className={classes.formControl}>
                  <OutlinedInput
                    id='destination-account-number'
                    name='destinationAccountNumber'
                    type='text'
                    value={formData.destinationAccountNumber}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position='start'><AccountCircle /></InputAdornment>}
                    labelWidth={0}
                    placeholder='Destination Account Number'
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant='outlined' fullWidth className={classes.formControl}>
                  <OutlinedInput
                    id='description'
                    name='description'
                    type='text'
                    value={formData.description}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position='start'><DescriptionIcon /></InputAdornment>}
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
                  disabled={loading}
                  fullWidth
                >
                  Transfer
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        {noAccounts && (
          <Typography className={classes.noAccounts}>
            No accounts available for transfer.
          </Typography>
        )}
      </Paper>
    </ReactSpring.animated.div>
  );
};

export default TransferForm;
