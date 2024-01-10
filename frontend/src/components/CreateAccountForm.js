import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Snackbar,
  makeStyles,
  Grid,
  CircularProgress
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    fontSize: '1rem'
  },
  formControl: {
    minWidth: 120,
    marginTop: theme.spacing(2)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const CreateAccountForm = ({ onAccountCreated }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    balance: '',
    accountType: '',
    currency: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (formData.accountNumber.length !== 15) newErrors.accountNumber = 'Account number must be a 15-digit number';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.balance || isNaN(formData.balance)) newErrors.balance = 'Balance must be a number';
    if (!['checking', 'savings', 'credit'].includes(formData.accountType)) newErrors.accountType = 'Invalid account type';
    if (!['USD', 'EUR', 'GBP'].includes(formData.currency)) newErrors.currency = 'Invalid currency';
    if (!['active', 'inactive'].includes(formData.status)) newErrors.status = 'Invalid status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setSnackbarMessage('User ID is missing. Please log in again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/accounts', { ...formData, userId });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setFormData({
        accountNumber: '',
        name: '',
        balance: '',
        accountType: '',
        currency: '',
        status: ''
      });
      setTimeout(() => {
        setLoading(false);
        onAccountCreated();
      }, 6000);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'An error occurred');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            required
            fullWidth
            id='accountNumber'
            label='Account Number'
            name='accountNumber'
            autoComplete='account-number'
            value={formData.accountNumber}
            onChange={handleChange}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber || 'Must be a 15-digit number'}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            required
            fullWidth
            id='name'
            label='Name'
            name='name'
            autoComplete='name'
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            required
            fullWidth
            id='balance'
            label='Amount'
            name='balance'
            type='number'
            autoComplete='balance'
            value={formData.balance}
            onChange={handleChange}
            error={!!errors.balance}
            helperText={errors.balance}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant='outlined' fullWidth required error={!!errors.accountType}>
            <InputLabel id='accountType-label'>Account Type</InputLabel>
            <Select
              labelId='accountType-label'
              id='accountType'
              name='accountType'
              value={formData.accountType}
              onChange={handleChange}
              label='Account Type'
            >
              <MenuItem value='checking'>Checking</MenuItem>
              <MenuItem value='savings'>Savings</MenuItem>
              <MenuItem value='credit'>Credit</MenuItem>
            </Select>
            <FormHelperText>{errors.accountType}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant='outlined' fullWidth required error={!!errors.currency}>
            <InputLabel id='currency-label'>Currency</InputLabel>
            <Select
              labelId='currency-label'
              id='currency'
              name='currency'
              value={formData.currency}
              onChange={handleChange}
              label='Currency'
            >
              <MenuItem value='USD'>USD</MenuItem>
              <MenuItem value='EUR'>EUR</MenuItem>
              <MenuItem value='GBP'>GBP</MenuItem>
              <MenuItem value='KSH'>KSH</MenuItem>
            </Select>
            <FormHelperText>{errors.currency}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant='outlined' fullWidth required error={!!errors.status}>
            <InputLabel id='status-label'>Status</InputLabel>
            <Select
              labelId='status-label'
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              label='Status'
            >
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
            <FormHelperText>{errors.status}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant='filled' severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </form>
  );
};

export default CreateAccountForm;
