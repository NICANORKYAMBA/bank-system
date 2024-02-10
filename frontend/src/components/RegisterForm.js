import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { setUserData, setUserAddress } from '../redux/actions/userActions';
import {
  updateFormData,
  clearFormData,
  setFormError,
  setFormErrors,
  clearFormErrors,
  resetForm,
  setIsSubmitting,
  setSnackbarMessage,
  toggleShowPassword,
  toggleShowConfirmPassword,
  setConfirmPassword,
  setPasswordStrength,
  setOpenSnackbar,
  setTermsAccepted,
  setErrorMessage,
  setIsAdmin
} from '../redux/actions/RegisterFormActions';
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
    padding: theme.spacing(2),
    margin: theme.spacing(1, 'auto'),
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
  const history = useHistory();
  const dispatch = useDispatch();

  const formData = useSelector(state => state.registerForm.formData || {});
  const formErrors = useSelector(state => state.registerForm.formErrors);
  const isSubmitting = useSelector(state => state.registerForm.isSubmitting);
  const snackbarMessage = useSelector(state => state.registerForm.snackbarMessage);
  const showPassword = useSelector(state => state.registerForm.showPassword);
  const showConfirmPassword = useSelector(state => state.registerForm.showConfirmPassword);
  const confirmPassword = useSelector(state => state.registerForm.confirmPassword);
  const passwordStrength = useSelector(state => state.registerForm.passwordStrength);
  const termsAccepted = useSelector(state => state.registerForm.termsAccepted);
  const isAdmin = useSelector(state => state.registerForm.isAdmin);
  const openSnackbar = useSelector(state => state.registerForm.openSnackbar);
  const errorMessage = useSelector(state => state.registerForm.errorMessage);

  useEffect(() => {
    return () => {
      dispatch(clearFormData());
      dispatch(clearFormErrors());
    };
  }, [dispatch]);

  const handleClickShowPassword = () => {
    dispatch(toggleShowPassword(!showPassword));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData(name, value));
  };

  const handleIsAdminChange = (event) => {
    dispatch(setIsAdmin(event.target.checked));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData('address', { ...formData.address, [name]: value }));
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    dispatch(setConfirmPassword(newConfirmPassword));
    const passwordMismatchError = formData.password !== newConfirmPassword ? 'Passwords do not match' : '';
    if (passwordMismatchError) {
      dispatch(setFormError('confirmPassword', passwordMismatchError));
    }
  };

  const handleClickShowConfirmPassword = () => {
    dispatch(toggleShowConfirmPassword(!showConfirmPassword));
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    const strength = calculatePasswordStrength(e.target.value);
    dispatch(setPasswordStrength(strength));
  };

  const handleTermsChange = (event) => {
    dispatch(setTermsAccepted(event.target.checked));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setOpenSnackbar(false));
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

    dispatch(setFormErrors(errors));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(setIsSubmitting(true));

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        ...formData,
        isAdmin: formData.isAdmin ? 'true' : 'false'
      });

      if (response.status === 201) {
        const {
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          dateOfBirth,
          addresses
        } = response.data.userData;

        dispatch(setUserData({
          userId, firstName, lastName, email, phoneNumber, dateOfBirth
        }));
        dispatch(setUserAddress(addresses));
        dispatch(setSnackbarMessage('Registration successful! Redirecting...'));
        dispatch(setOpenSnackbar(true));

        setTimeout(() => {
          history.push('/dashboard');
        }, 6000);

        dispatch(resetForm());
      } else {
        throw new Error('Server responded with a status other than 201');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('already exists')) {
          dispatch(setFormErrors({ email: 'Email already exists' }));
          dispatch(setSnackbarMessage('Email already exists'));
        } else {
          dispatch(setErrorMessage(error.response.data.message));
          dispatch(setSnackbarMessage(error.response.data.message));
        }
        dispatch(setOpenSnackbar(true));
      }
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper>
        <div className={classes.registerForm}>
          <Typography
            variant='h4'
            align='center'
            className={classes.title}
          >
            Register
          </Typography>
          {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
          <form
            noValidate autoComplete='off'
            onSubmit={handleSubmit}
          >
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
                  checked={isAdmin}
                  onChange={handleIsAdminChange}
                  name='isAdmin'
                  color='primary'
                />
      }
              label='Create as Admin'
            />
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
            <Snackbar open={openSnackbar} autoHideDuration={15000} onClose={handleCloseSnackbar}>
              <MuiAlert onClose={handleCloseSnackbar} severity='success' elevation={6} variant='filled'>
                {snackbarMessage}
              </MuiAlert>
            </Snackbar>
          </form>
        </div>
      </Paper>
    </Grid>
  );
};

export default RegisterForm;
