import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUserData, setUserAddress
} from '../redux/actions/userActions';
import {
  updateFormData,
  setAuthToken,
  clearFormData,
  setFormError,
  clearFormErrors,
  toggleShowPassword,
  toggleShowConfirmPassword,
  setIsSubmitting,
  setSnackbarMessage,
  setOpenSnackbar,
  resetShowPassword,
  resetShowConfirmPassword
} from '../redux/actions/LoginFormActions';
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
  FormControlLabel,
  CircularProgress,
  Snackbar
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const FIELD_EMAIL = 'email';
const FIELD_PASSWORD = 'password';
const FIELD_CONFIRM_PASSWORD = 'confirmPassword';

const useStyles = makeStyles((theme) => ({
  loginForm: {
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
  loginInput: {
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
  loginButton: {
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

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function LoginForm () {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const formData = useSelector(state => state.loginForm.formData || {});
  const errors = useSelector(state => state.loginForm.errors || {});
  const isSubmitting = useSelector(
    state => state.loginForm.isSubmitting || false);
  const openSnackbar = useSelector(
    state => state.loginForm.openSnackbar || false);
  const snackbarMessage = useSelector(
    state => state.loginForm.snackbarMessage || '');
  const showPassword = useSelector(
    state => state.loginForm.showPassword || false);
  const showConfirmPassword = useSelector(
    state => state.loginForm.showConfirmPassword || false);

  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (formData.password && formData.confirmPassword &&
      formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  }, [formData]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setOpenSnackbar(false));
  };

  const handleClickShowPassword = () => {
    dispatch(toggleShowPassword(!showPassword));
  };

  const handleClickShowConfirmPassword = () => {
    dispatch(toggleShowConfirmPassword(!showConfirmPassword));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData(name, value));
    if (name === 'password' || name === 'confirmPassword') {
      if (formData.password !== formData.confirmPassword) {
        dispatch(setFormError('confirmPassword', 'Passwords do not match.'));
      } else {
        dispatch(setFormError('confirmPassword', ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      dispatch(setFormError({
        key: FIELD_EMAIL,
        value: 'Please enter your email.'
      }));
      dispatch(setSnackbarMessage('Please enter your email.'));
      dispatch(setOpenSnackbar(true));
      return;
    }
    if (!formData.password) {
      dispatch(setFormError({
        key: FIELD_PASSWORD,
        value: 'Please enter your password.'
      }));
      dispatch(setSnackbarMessage('Please enter your password.'));
      dispatch(setOpenSnackbar(true));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch(setFormError({
        key: FIELD_CONFIRM_PASSWORD,
        value: 'Passwords do not match.'
      }));
      dispatch(setSnackbarMessage('Passwords do not match.'));
      dispatch(setOpenSnackbar(true));
      return;
    }

    dispatch(setIsSubmitting(true));
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        const {
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          dateOfBirth,
          isAdmin,
          addresses
        } = response.data.userData;

        dispatch(setUserData({
          userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          dateOfBirth,
          isAdmin
        }));
        dispatch(setUserAddress(addresses));
        dispatch(setSnackbarMessage('Login successful! Redirecting...'));
        dispatch(setOpenSnackbar(true));
        dispatch(setAuthToken(response.data.token));
        dispatch(clearFormData());
        dispatch(clearFormErrors());

        setTimeout(() => {
          history.push('/dashboard');
        }, 2000);
      } else {
        throw new Error(`Server responded with a status: ${response.status}`);
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error.response) {
        errorMessage = error.response.data.message;
      }
      dispatch(setSnackbarMessage(errorMessage));
      dispatch(setOpenSnackbar(true));

      dispatch(clearFormData());
      dispatch(clearFormErrors());
    } finally {
      dispatch(setIsSubmitting(false));
      dispatch(resetShowPassword());
      dispatch(resetShowConfirmPassword());
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper className={classes.loginForm}>
        <Typography
          variant='h4'
          align='center'
          className={classes.title}
        >
          Login
        </Typography>
        <form
          noValidate autoComplete='off'
          onSubmit={handleSubmit}
        >
          <TextField
            className={classes.loginInput}
            label='Email'
            type='email'
            variant='outlined'
            required
            name='email'
            onChange={handleChange}
            InputProps={{
              startAdornment: <EmailIcon />
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            className={classes.loginInput}
            label='Password'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            required
            name='password'
            onChange={handleChange}
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
                </InputAdornment>
              )
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            className={classes.loginInput}
            label='Confirm Password'
            type={showConfirmPassword ? 'text' : 'password'}
            variant='outlined'
            required
            name='confirmPassword'
            onChange={handleChange}
            InputProps={{
              startAdornment: <LockIcon />,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowConfirmPassword}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError || ' '}
          />
          <Grid
            container direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <FormControlLabel
              className={classes.loginCheckbox}
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              className={classes.loginButton}
              variant='contained'
              color='primary'
              type='submit'
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Typography
              variant='body2'
              style={{ marginTop: '1rem', textAlign: 'center' }}
            >
              Forgot password?
              <Button
                variant='text'
                color='primary'
                component={Link} to='#'
              >
                Click here
              </Button>
            </Typography>
            <Typography
              variant='body2'
              style={{ marginTop: '1rem', textAlign: 'center' }}
            >
              Don't have an account?
              <Button
                variant='text'
                color='primary'
                component={Link}
                to='/registration'
              >
                Register here
              </Button>
            </Typography>
          </Grid>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={
              snackbarMessage.startsWith('Login successful')
                ? 'success'
                : 'error'
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
}

export default LoginForm;
