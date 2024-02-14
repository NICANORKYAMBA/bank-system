import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserId } from '../redux/selectors/userSelectors';
import axios from 'axios';
import {
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { 
  fetchAccountsByStatus 
} from '../api/api';
import MuiAlert from '@material-ui/lab/Alert';

const ActivateAccountPage = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [inactiveAccounts, setInactiveAccounts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const history = useHistory();
  const userId = useSelector(getUserId);

  useEffect(() => {
    const loadInactiveAccounts = async () => {
      try {
        const accounts = await fetchAccountsByStatus(userId, 'inactive');
        if (accounts.length === 0) {
          setSnackbarMessage('No inactive accounts found.');
          setSnackbarSeverity('info');
          setOpenSnackbar(true);
        } else {
          setInactiveAccounts(accounts);
        }
      } catch (error) {
        console.error('Failed to fetch inactive accounts:', error);
        setSnackbarMessage('An error occurred while fetching inactive accounts. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    loadInactiveAccounts();
  }, [userId]);

  const handleActivateAccount = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/accounts/${accountNumber}/activate`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setSnackbarMessage('Account activated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => history.push('/dashboard'), 2000);
      } else {
        setSnackbarMessage('Failed to activate account. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('There was an error activating the account:', error);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  };

  return (
    <Container maxWidth='sm'>
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant='h4' align='center' gutterBottom>
              Activate Account
            </Typography>
            {inactiveAccounts.length > 0
              ? (
                <form onSubmit={handleActivateAccount}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin='normal'>
                        <InputLabel id='account-number-label'>
                          Account Number
                        </InputLabel>
                        <Select
                          labelId='account-number-label'
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          required
                        >
                          {inactiveAccounts.map((account) => (
                            <MenuItem key={account.id} value={account.accountNumber}>
                              {account.accountNumber}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type='submit'
                        color='primary'
                        variant='contained'
                        fullWidth
                      >
                        Activate Account
                      </Button>
                    </Grid>
                  </Grid>
                </form>
                )
              : (
                <Typography variant='subtitle1' align='center'>
                  There are no inactive accounts available for activation.
                </Typography>
                )}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ActivateAccountPage;
