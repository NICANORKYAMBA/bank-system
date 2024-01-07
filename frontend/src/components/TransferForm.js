import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  makeStyles,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Paper,
  FormControl,
  FormHelperText,
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

  const [accounts, setAccounts] = useState([]);
  const [noAccounts, setNoAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/accounts/user/${userId}`);
        if (response.data && response.data.accounts.length === 0) {
          setNoAccounts(true);
        } else {
          setAccounts(response.data.accounts);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [formData, setFormData] = useState({
    type: 'transfer',
    amount: '',
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    description: ''
  });

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
      console.log(response.data);
      setSnackbarMessage('Transfer initiated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const props = ReactSpring.useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <ReactSpring.animated.div style={props}>
      {loading
        ? (
          <div className={classes.progress}>
            <CircularProgress />
          </div>
          )
        : (
          <Paper className={classes.paper}>
            <Typography className={classes.title}>Transfer Form</Typography>
            {error && <Typography color='error'>{error}</Typography>}
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl variant='outlined' className={classes.formControl} required>
                    <OutlinedInput
                      id='amount'
                      name='amount'
                      type='number'
                      value={formData.amount}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position='start'>
                          <MoneyIcon className={classes.inputIcon} />
                        </InputAdornment>
                    }
                      labelWidth={0}
                    />
                    <FormHelperText>Amount</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {noAccounts
                    ? (
                      <Typography color='textSecondary'>No accounts to select.</Typography>
                      )
                    : (
                      <>
                        <InputLabel htmlFor='source-account-number' style={{ marginLeft: '15px' }}>
                          Source Account Number *
                        </InputLabel>
                        <Select
                          className={classes.formControl}
                          value={formData.sourceAccountNumber}
                          onChange={handleChange}
                          inputProps={{
                            name: 'sourceAccountNumber',
                            id: 'source-account-number'
                          }}
                          required
                          startAdornment={
                            <InputAdornment position='start'>
                              <AccountCircle className={classes.inputIcon} />
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
                      </>
                      )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.formControl}
                    label='Destination Account Number'
                    type='text'
                    name='destinationAccountNumber'
                    value={formData.destinationAccountNumber}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountCircle className={classes.inputIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.formControl}
                    label='Description'
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <DescriptionIcon className={classes.inputIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                className={classes.formButton}
                variant='contained'
                color='primary'
                type='submit'
              >
                Initiate Transfer
              </Button>
            </form>
          </Paper>
          )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ReactSpring.animated.div>
  );
};

export default TransferForm;
