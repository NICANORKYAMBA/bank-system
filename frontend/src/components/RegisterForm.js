import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  makeStyles
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  registerForm: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 400,
    height: 'auto',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px'
  },
  registerInput: {
    margin: theme.spacing(2, 0),
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
    margin: theme.spacing(2, 0),
    backgroundColor: '#1976D2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#135895'
    }
  },
  title: {
    margin: theme.spacing(2, 0),
    color: '#1976D2'
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

    setFormErrors(errors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', formData);
      console.log(response.data);
      setErrorMessage('');
      setFormErrors({});
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('already exists')) {
          setFormErrors({ email: 'Email already exists' });
        } else {
          setErrorMessage(error.response.data.message);
        }
      }
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Paper>
        <div className={classes.registerForm}>
          <Typography variant='h4' align='center'>
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
              onChange={handleChange}
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
                  </InputAdornment>
                )
              }}
              error={!!formErrors.password}
              helperText={formErrors.password}
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
            <Button
              variant='contained'
              color='primary'
              type='submit'
              fullWidth
              className={classes.registerButton}
            >
              Register
            </Button>
          </form>
        </div>
      </Paper>
    </Grid>
  );
};

export default RegisterForm;
