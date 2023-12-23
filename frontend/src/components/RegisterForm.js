import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, InputAdornment, IconButton } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Grid container justify='center'>
      <Paper>
        <div className={styles.registerForm}>
          <Typography variant='h4' align='center'>
            Register
          </Typography>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              label='Email'
              type='email'
              name='email'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={styles.registerInput}
              variant='outlined'
              InputProps={{
                startAdornment: <EmailIcon />
              }}
            />
            <TextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={styles.registerInput}
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
            />
            <TextField
              label='First Name'
              type='text'
              name='firstName'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='Last Name'
              type='text'
              name='lastName'
              required
              fullWidth
              margin='normal'
              onChange={handleChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='Street'
              type='text'
              name='street'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='City'
              type='text'
              name='city'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='State'
              type='text'
              name='state'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='Country'
              type='text'
              name='country'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <TextField
              label='Zip Code'
              type='text'
              name='zipCode'
              fullWidth
              margin='normal'
              onChange={handleAddressChange}
              className={styles.registerInput}
              variant='outlined'
            />
            <Button
              variant='contained'
              color='primary'
              type='submit'
              fullWidth
              className={styles.registerButton}
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
