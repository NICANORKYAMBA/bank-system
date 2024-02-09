import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId } from '../redux/selectors/userSelectors';
import { setUserData } from '../redux/actions/userActions';
import {
  Button,
  TextField,
  Container,
  Typography,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { updateUserProfile } from '../api/api';

const ProfileManagementForm = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const storedUserId = useSelector((state) => getUserId(state));

  const history = useHistory();

  useEffect(() => {
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      history.push('/login');
    }
  }, [storedUserId, history]);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleAddressChange = (field) => (event) => {
    setAddress({ ...address, [field]: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

    if (!firstName.trim()) {
      formIsValid = false;
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      formIsValid = false;
      errors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      formIsValid = false;
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formIsValid = false;
      errors.email = 'Email is not valid';
    }

    if (password && password !== confirmPassword) {
      formIsValid = false;
      errors.confirmPassword = 'Passwords do not match';
    }

    if (address.street && !address.street.trim()) {
      formIsValid = false;
      errors.street = 'Street cannot be just whitespace';
    }

    if (address.city && !address.city.trim()) {
      formIsValid = false;
      errors.city = 'City cannot be just whitespace';
    }

    if (address.state && !address.state.trim()) {
      formIsValid = false;
      errors.state = 'State cannot be just whitespace';
    }

    if (address.country && !address.country.trim()) {
      formIsValid = false;
      errors.country = 'Country cannot be just whitespace';
    }

    if (address.zipCode && !address.zipCode.trim()) {
      formIsValid = false;
      errors.zipCode = 'Zip code cannot be just whitespace';
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm() && userId) {
      setLoading(true);
      const userData = {
        firstName,
        lastName,
        email,
        ...(password && { password }),
        address
      };

      try {
        const response = await updateUserProfile(userId, userData);
        if (response.data && response.data.status === 200) {
          setSnackbarOpen(true);
          setSnackbarMessage(
            'Profile updated successfully. You will be redirected to your dashboard shortly.'
          );
          setSnackbarSeverity('success');
          dispatch(setUserData(response.data.user));
          history.push('/dashboard');
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage('Failed to update profile');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        setSnackbarOpen(true);
        setSnackbarMessage(error.response?.data?.message || 'Failed to update profile');
        setSnackbarSeverity('error');
      }
    }
  };

  return userId
    ? (
      <Container component='main' maxWidth='sm'>
        <Card>
          <CardContent>
            <Typography variant='h5' component='h2' gutterBottom>
              Profile Management
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='firstName'
                    label='First Name'
                    name='firstName'
                    value={firstName}
                    onChange={handleInputChange(setFirstName)}
                    autoComplete='given-name'
                    error={!!formErrors.firstName}
                    placeholder='Enter your updated first name'
                    helperText={formErrors.firstName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='lastName'
                    label='Last Name'
                    name='lastName'
                    value={lastName}
                    onChange={handleInputChange(setLastName)}
                    autoComplete='family-name'
                    error={!!formErrors.lastName}
                    placeholder='Enter your updated last name'
                    helperText={formErrors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    type='email'
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    autoComplete='email'
                    error={!!formErrors.email}
                    placeholder='Enter your New Email Address'
                    helperText={formErrors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='password'
                    label='Password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete='new-password'
                    error={!!formErrors.password}
                    placeholder='Enter New Password'
                    helperText={formErrors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete='new-password'
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    placeholder='Enter New Confirm Password'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle confirm password visibility'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge='end'
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='street'
                    label='Street'
                    name='street'
                    value={address.street}
                    onChange={handleAddressChange('street')}
                    autoComplete='street-address'
                    placeholder='Enter New Street Name'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='city'
                    label='City'
                    name='city'
                    value={address.city}
                    onChange={handleAddressChange('city')}
                    autoComplete='address-level2'
                    placeholder='Enter New City Name'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='state'
                    label='State'
                    name='state'
                    value={address.state}
                    onChange={handleAddressChange('state')}
                    autoComplete='address-level1'
                    placeholder='Enter New State Name'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='country'
                    label='Country'
                    name='country'
                    value={address.country}
                    onChange={handleAddressChange('country')}
                    autoComplete='country'
                    placeholder='Enter New Country Name'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='zipCode'
                    label='Zip Code'
                    name='zipCode'
                    value={address.zipCode}
                    onChange={handleAddressChange('zipCode')}
                    autoComplete='postal-code'
                    placeholder='Enter New Zip Code'
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                disabled={loading}
                style={{ marginTop: '16px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Snackbar
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
      </Container>
      )
    : null;
};

export default ProfileManagementForm;
