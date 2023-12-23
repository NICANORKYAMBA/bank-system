import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Checkbox, FormControlLabel, Link, IconButton, InputAdornment } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import styles from './LoginForm.module.css';

function LoginForm () {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container justify='center'>
      <Paper className={styles.loginForm}>
        <Typography variant='h4' align='center'>
          Login
        </Typography>
        <form noValidate autoComplete='off'>
          <TextField
            className={styles.loginInput}
            label='Email'
            type='email'
            variant='outlined'
            required
            InputProps={{
              startAdornment: <EmailIcon />
            }}
          />
          <TextField
            className={styles.loginInput}
            label='Password'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            required
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
          <FormControlLabel
            className={styles.loginCheckbox}
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            className={styles.loginButton}
            variant='contained'
            color='primary'
            type='submit'
          >
            Login
          </Button>
          <Link href='#' variant='body2'>
            Forgot password?
          </Link>
        </form>
      </Paper>
    </Grid>
  );
}

export default LoginForm;
