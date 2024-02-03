import React, { useEffect, useState } from 'react';
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
  FormControl,
  OutlinedInput,
  CircularProgress,
  InputAdornment
} from '@material-ui/core';
import {
  fetchAllAccountsDataThunk
} from '../redux/actions/QuickActions';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import ReferenceIcon from '@material-ui/icons/AssignmentTurnedIn';
import PublicIcon from '@material-ui/icons/Public';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LinkIcon from '@material-ui/icons/Link';
import MuiAlert from '@material-ui/lab/Alert';
import * as ReactSpring from 'react-spring';
import axios from 'axios';
import { getUserId } from '../redux/selectors/userSelectors';

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
    marginBottom: theme.spacing(3),
    maxHeight: '70vh'
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

const TransferForm = ({ handleClose, onTransactionCreated }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const accounts = useSelector(state => state.quick.accountsData);
  const userId = useSelector(getUserId);

  const [formData, setFormData] = useState({
    type: 'transfer',
    amount: '',
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    description: '',
    fee: '',
    exchangeRate: '',
    transactionReference: '',
    channel: '',
    ipAddress: '',
    deviceInformation: '',
    checkNumber: '',
    attachmentUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllAccountsDataThunk(userId));
    }
  }, [userId, dispatch]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      'amount',
      'sourceAccountNumber',
      'destinationAccountNumber',
      'transactionReference',
      'channel'
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setSnackbarMessage(`Please fill in the ${field} field.`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }

    setLoading(true);
    const data = {
      type: formData.type,
      amount: formData.amount,
      sourceAccountNumber: formData.sourceAccountNumber,
      destinationAccountNumber: formData.destinationAccountNumber,
      transactionReference: formData.transactionReference,
      channel: formData.channel,
      userId
    };

    if (formData.description) data.description = formData.description;
    if (formData.fee) data.fee = formData.fee;
    if (formData.exchangeRate) data.exchangeRate = formData.exchangeRate;
    if (formData.ipAddress) data.ipAddress = formData.ipAddress;
    if (formData.deviceInformation) data.deviceInformation = formData.deviceInformation;
    if (formData.checkNumber) data.checkNumber = formData.checkNumber;
    if (formData.attachmentUrl) data.attachmentUrl = formData.attachmentUrl;

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:5000/api/transactions', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSnackbarMessage('Transfer initiated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onTransactionCreated();
      setTimeout(() => {
        handleClose();
      }, 6000);
    } catch (error) {
      console.error('Error initiating transfer: ', error);
      setSnackbarMessage('Failed to initiate transfer. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const props = ReactSpring.useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <ReactSpring.animated.div style={props}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Paper className={classes.paper} elevation={3}>
        <Typography className={classes.title} variant='h4'>
          Transfer Funds
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
                    <InputAdornment position='start'>
                      <MoneyIcon />
                    </InputAdornment>
}
                  labelWidth={0}
                  placeholder='Amount'
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <InputLabel htmlFor='source-account-number'>
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
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  }
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
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='destination-account-number'
                  name='destinationAccountNumber'
                  type='text'
                  value={formData.destinationAccountNumber}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <AccountCircle />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Destination Account Number *'
                  required
                />
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
                    <InputAdornment position='start'>
                      <DescriptionIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Description'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='fee'
                  name='fee'
                  type='number'
                  value={formData.fee}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment
                      position='start'
                    >
                      <AttachMoneyIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Fee'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='exchange-rate'
                  name='exchangeRate'
                  type='number'
                  value={formData.exchangeRate}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment
                      position='start'
                    >
                      <SyncAltIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Exchange Rate'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='transaction-reference'
                  name='transactionReference'
                  type='text'
                  value={formData.transactionReference}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <ReferenceIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Transaction Reference *'
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <InputLabel htmlFor='channel'>Channel</InputLabel>
                <Select
                  value={formData.channel}
                  onChange={handleChange}
                  label='Channel *'
                  inputProps={{
                    name: 'channel',
                    id: 'channel'
                  }}
                  required
                >
                  <MenuItem value='online'>Online</MenuItem>
                  <MenuItem value='branch'>Branch</MenuItem>
                  <MenuItem value='ATM'>ATM</MenuItem>
                  <MenuItem value='mobile'>Mobile</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='ip-address'
                  name='ipAddress'
                  type='text'
                  value={formData.ipAddress}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <PublicIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='IP Address'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='device-information'
                  name='deviceInformation'
                  type='text'
                  value={formData.deviceInformation}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <DevicesOtherIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Device Information'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='check-number'
                  name='checkNumber'
                  type='text'
                  value={formData.checkNumber}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <CheckCircleOutlineIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Check Number'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant='outlined'
                fullWidth className={classes.formControl}
              >
                <OutlinedInput
                  id='attachment-url'
                  name='attachmentUrl'
                  type='text'
                  value={formData.attachmentUrl}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position='start'>
                      <LinkIcon />
                    </InputAdornment>
                  }
                  labelWidth={0}
                  placeholder='Attachment URL'
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
                startIcon={
                  loading ? <CircularProgress size={20} color='inherit' /> : null
}
              >
                {loading ? 'Processing' : 'Transfer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ReactSpring.animated.div>
  );
};

export default TransferForm;
