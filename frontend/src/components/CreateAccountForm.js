import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserId
} from '../redux/selectors/userSelectors';
import {
  updateFormData,
  validateForm,
  setErrors,
  submitForm,
  setLoading,
  setSnackbarState,
  resetForm
} from '../redux/actions/CreateAccountFormActions';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Snackbar,
  Grid,
  CircularProgress,
  Switch,
  FormGroup,
  FormControlLabel,
  Typography,
  makeStyles
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    minHeight: '100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(4)
  },
  form: {
    marginTop: theme.spacing(3),
    maxWidth: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
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
  switchControl: {
    marginTop: theme.spacing(1)
  },
  successIcon: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1)
  },
  errorIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(1)
  },
  optionalInput: {
    fontStyle: 'italic'
  }
}));

const CreateAccountForm = ({ onAccountCreated }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const formData = useSelector(state => state.createAccountForm.formData);
  const errors = useSelector(state => state.createAccountForm.errors);
  const loading = useSelector(state => state.createAccountForm.loading);
  const snackbarState = useSelector(state => state.createAccountForm.snackbar);
  const openSnackbar = snackbarState.isOpen;
  const snackbarMessage = snackbarState.message;
  const snackbarSeverity = snackbarState.severity;
  const userId = useSelector(getUserId);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateFormData(name, value));
  };

  const validateLocalForm = () => {
    const newErrors = {};
    const missingFields = [];
    if (!formData.name) {
      newErrors.name = 'Name must be only alphabetical chars and spaces';
      missingFields.push('Name');
    }
    if (!formData.balance || isNaN(formData.balance) || formData.balance < 100) {
      newErrors.balance = 'Balance must be a number and at least 100';
      missingFields.push('Balance');
    }
    if (![
      'checking',
      'savings',
      'credit',
      'CD',
      'moneyMarket',
      'prepaid',
      'paypal',
      'businessChecking',
      'studentChecking',
      'travelersCheck'].includes(formData.accountType)) {
      newErrors.accountType = 'Account type must be one of: checking, savings, credit';
      missingFields.push('Account Type');
    }
    if (!['USD', 'EUR', 'GBP', 'KSH'].includes(formData.currency)) {
      newErrors.currency = 'Currency must be one of: USD, EUR, GBP';
      missingFields.push('Currency');
    }
    if (!['active', 'inactive'].includes(formData.status)) {
      newErrors.status = 'Status must be one of: active, inactive';
      missingFields.push('Status');
    }
    if (formData.interestRate && isNaN(formData.interestRate)) {
      newErrors.interestRate = 'Interest rate must be a number';
      missingFields.push('Interest Rate');
    }
    if (formData.overdraftLimit && isNaN(formData.overdraftLimit)) {
      newErrors.overdraftLimit = 'Overdraft limit must be a number';
      missingFields.push('Overdraft Limit');
    }
    if (formData.lastTransactionDate && !isValidDate(formData.lastTransactionDate)) {
      newErrors.lastTransactionDate = 'Last transaction date must be a valid ISO 8601 date';
      missingFields.push('Last Transaction Date');
    }

    dispatch(setErrors(newErrors));

    if (missingFields.length > 0) {
      dispatch(setSnackbarState(
        true,
      `Please fill in the following fields: ${missingFields.join(', ')}`, 'error'
      ));
    } else {
      dispatch(submitForm(formData));
    }

    return Object.keys(newErrors).length === 0;
  };

  function isValidDate (dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(validateForm(event.target.value));
    if (!validateLocalForm()) {
      return;
    }
    dispatch(setLoading(true));
    if (!userId) {
      dispatch(setSnackbarState(
        true, 'User ID is missing. Please log in again.', 'error'
      ));
      dispatch(setLoading(false));
      onAccountCreated();
      return;
    }
    try {
      const payload = {
        ...formData,
        userId,
        interestRate: formData.interestRate === '' ? null : formData.interestRate,
        overdraftLimit: formData.overdraftLimit === '' ? null : formData.overdraftLimit
      };

      const response = await axios.post('http://localhost:5000/api/accounts', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      dispatch(setSnackbarState(true, response.data.message, 'success'));
      dispatch(resetForm());
      dispatch(setLoading(false));
      onAccountCreated();
    } catch (error) {
      dispatch(setSnackbarState(
        true, error.response?.data?.message || 'An error occurred', 'error'
      ));
      dispatch(resetForm());
      dispatch(setLoading(false));
      onAccountCreated();
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(setSnackbarState(false));
  };

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <Grid
        container spacing={2}
        className={classes.formContainer}
      >
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
          <FormControl
            variant='outlined'
            fullWidth required error={
              !!errors.accountType
            }
          >
            <InputLabel
              id='accountType-label'
            >
              Account Type
            </InputLabel>
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
              <MenuItem value='CD'>CD</MenuItem>
              <MenuItem value='moneyMarket'>Money Market</MenuItem>
              <MenuItem value='prepaid'>Prepaid</MenuItem>
              <MenuItem value='paypal'>Paypal</MenuItem>
              <MenuItem value='businessChecking'>Business Checking</MenuItem>
              <MenuItem value='studentChecking'>Student Checking</MenuItem>
              <MenuItem value='travelersCheck'>Travelers Check</MenuItem>
            </Select>
            <FormHelperText>{errors.accountType}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            variant='outlined'
            fullWidth required error={!!errors.currency}
          >
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
          <FormGroup className={classes.switchControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={
                    (e) => dispatch(updateFormData(
                      'status', e.target.checked ? 'active' : 'inactive'
                    ))
                  }
                  name='status'
                  color='primary'
                />
              }
              label='Account Status'
            />
            <Typography
              variant='caption'
              color='error'
            >{errors.status}
            </Typography>
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            fullWidth
            id='interestRate'
            label='Interest Rate (Optional)'
            name='interestRate'
            type='number'
            autoComplete='interest-rate'
            value={formData.interestRate}
            onChange={handleChange}
            className={classes.optionalInput}
            helperText='If applicable'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            fullWidth
            id='overdraftLimit'
            label='Overdraft Limit (Optional)'
            name='overdraftLimit'
            type='number'
            autoComplete='overdraft-limit'
            value={formData.overdraftLimit}
            onChange={handleChange}
            className={classes.optionalInput}
            helperText='If applicable'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            fullWidth
            id='lastTransactionDate'
            label='Last Transaction Date (Optional)'
            name='lastTransactionDate'
            type='date'
            autoComplete='last-transaction-date'
            value={formData.lastTransactionDate}
            onChange={handleChange}
            className={classes.optionalInput}
            InputLabelProps={{
              shrink: true
            }}
            helperText='If applicable'
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={loading}
            startIcon={
              loading
                ? <CircularProgress size={24} />
                : <CheckCircleOutlineIcon />
            }
          >
            Create Account
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          severity={snackbarSeverity}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize='inherit' />,
            error: <ErrorOutlineIcon fontSize='inherit' />
          }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </form>
  );
};

export default CreateAccountForm;
