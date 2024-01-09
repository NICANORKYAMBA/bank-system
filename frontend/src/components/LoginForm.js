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

const useStyles = makeStyles((theme) => ({
  loginForm: {
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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password' || name === 'confirmPassword') {
      const passwordError = name === 'password' && !value ? 'Please enter your password.' : '';
      const confirmPasswordError = formData.password !== value ? 'Passwords do not match.' : '';
      setErrors({
        ...errors,
        password: passwordError,
        confirmPassword: name === 'confirmPassword' ? confirmPasswordError : errors.confirmPassword
      });
    }
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter your email.' }));
      return;
    }
    if (!formData.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Please enter your password.' }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Passwords do not match.' }));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      setSnackbar({ open: true, message: 'Login successful! Redirecting...' });
      setErrors({ email: '', password: '' });

      sessionStorage.setItem('userId', response.data.userId);
      sessionStorage.setItem('firstName', response.data.firstName);
      sessionStorage.setItem('lastName', response.data.lastName);

      setTimeout(() => {
        history.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('Incorrect password')) {
          setErrors({ email: '', password: 'Incorrect password. Please try again.' });
          setSnackbar({ open: true, message: 'Incorrect password. Please try again.' });
        } else if (errorMessage.includes('User not found')) {
          setErrors({ email: 'User not found', password: '' });
          setSnackbar({ open: true, message: 'User not found. Please check your email.' });
        } else {
          setSnackbar({ open: true, message: 'An unexpected error occurred. Please try again later.' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper className={classes.loginForm}>
        <Typography variant='h4' align='center' className={classes.title}>
          Login
        </Typography>
        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
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
            type={showPassword ? 'text' : 'password'}
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
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Grid container direction='column' justifyContent='center' alignItems='center'>
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
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Typography variant='body2' style={{ marginTop: '1rem', textAlign: 'center' }}>
              Forgot password?
              <Button variant='text' color='primary' component={Link} to='#'>
                Click here
              </Button>
            </Typography>
            <Typography variant='body2' style={{ marginTop: '1rem', textAlign: 'center' }}>
              Don't have an account?
              <Button variant='text' color='primary' component={Link} to='/registration'>
                Register here
              </Button>
            </Typography>
          </Grid>
        </form>
        <Snackbar open={snackbar.open} autoHideDuration={15000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity='success'>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
}

export default LoginForm;
