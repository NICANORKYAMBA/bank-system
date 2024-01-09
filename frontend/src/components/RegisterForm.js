import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  makeStyles,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { calculatePasswordStrength } from './PasswordStrengthCalculator';

const useStyles = makeStyles((theme) => ({
  registerForm: {
    padding: theme.spacing(4),
    margin: theme.spacing(2, 'auto'),
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2)
    }
  },
  registerInput: {
    margin: theme.spacing(1, 0),
    width: '100%',
    '& label.Mui-focused': {
      color: '#1976D2'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1976D2'
      }
    }
  },
  registerButton: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  title: {
    margin: theme.spacing(2, 0),
    color: theme.palette.primary.main
  }
}));

const RegisterForm = () => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value
      }
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    setFormErrors(prevErrors => ({
      ...prevErrors,
      confirmPassword: formData.password !== newConfirmPassword ? 'Passwords do not match' : ''
    }));
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const handleTermsChange = (event) => {
    setTermsAccepted(event.target.checked);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.email.trim()) {
      isValid = false;
      errors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      isValid = false;
      errors.password = 'Password is required';
    }

    if (!formData.firstName.trim()) {
      isValid = false;
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      isValid = false;
      errors.lastName = 'Last name is required';
    }

    if (!termsAccepted) {
      isValid = false;
      errors.termsAccepted = 'You must accept the terms and conditions';
    }

    if (formData.password !== confirmPassword) {
      isValid = false;
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);

    return isValid;
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);

      if (response.status >= 200 && response.status <= 299) {
        console.log(response.data);
        setErrorMessage('');
        setFormErrors({});

        const user = response.data.user;

        sessionStorage.setItem('userId', user.userId);
        sessionStorage.setItem('firstName', user.firstName);
        sessionStorage.setItem('lastName', user.lastName);
        sessionStorage.setItem('email', user.email);

        history.push('/dashboard');

        setOpenSnackbar(true);
      } else {
        throw new Error('Server responded with a status other than 2xx');
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('already exists')) {
          setFormErrors({ email: 'Email already exists' });
        } else {
          setErrorMessage(error.response.data.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper>
        <div className={classes.registerForm}>
          <Typography variant='h4' align='center' className={classes.title}>
            Register
          </Typography>
          {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              label='Email'
              type='email'
              name='email'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={classes.registerInput}
              variant='outlined'
              InputProps={{
                startAdornment: <EmailIcon />
              }}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              required
              fullWidth
              margin='normal'
              onChange={handlePasswordChange}
              className={classes.registerInput}
              variant='outlined'
              InputProps={{
                startAdornment: <LockIcon />,
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    {passwordStrength && (
                      <div style={{ marginLeft: '10px' }}>
                        <PasswordStrengthIndicator strength={passwordStrength} />
                      </div>
                    )}
                  </InputAdornment>
                )
              }}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              label='Confirm Password'
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              required
              fullWidth
              margin='normal'
              onChange={handleConfirmPasswordChange}
              className={classes.registerInput}
              variant='outlined'
              InputProps={{
                startAdornment: <LockIcon />,
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle confirm password visibility'
                      onClick={handleClickShowConfirmPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
            <TextField
              label='First Name'
              type='text'
              name='firstName'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
            <TextField
              label='Last Name'
              type='text'
              name='lastName'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
            <TextField
              label='Street'
              type='text'
              name='street'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.street}
              helperText={formErrors.street}
            />
            <TextField
              label='City'
              type='text'
              name='city'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.city}
              helperText={formErrors.city}
            />
            <TextField
              label='State'
              type='text'
              name='state'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.state}
              helperText={formErrors.state}
            />
            <TextField
              label='Country'
              type='text'
              name='country'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.country}
              helperText={formErrors.country}
            />
            <TextField
              label='Zip Code'
              type='text'
              name='zipCode'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={classes.registerInput}
              variant='outlined'
              error={!!formErrors.zipCode}
              helperText={formErrors.zipCode}
            />
            {formErrors.termsAccepted && (
              <Typography color='error'>{formErrors.termsAccepted}</Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  name='termsAccepted'
                  color='primary'
                />
              }
              label='I agree to the Terms and Conditions'
            />
            <Button
              variant='contained'
              color='primary'
              type='submit'
              fullWidth
              className={classes.registerButton}
              disabled={!termsAccepted || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Typography variant='body2' style={{ marginTop: '1rem', textAlign: 'center' }}>
              Already have an account?
              <Button variant='text' color='primary' component={Link} to='/login'>
                Log in
              </Button>
            </Typography>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <MuiAlert onClose={handleCloseSnackbar} severity='success' elevation={6} variant='filled'>
                Registration successful!
              </MuiAlert>
            </Snackbar>
          </form>
        </div>
      </Paper>
    </Grid>
  );
};

export default RegisterForm;
