import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Link, IconButton,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  loginForm: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 400,
    height: 'auto',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px'
  },
  loginInput: {
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
  loginCheckbox: {
    margin: theme.spacing(1, 0)
  },
  loginButton: {
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

function LoginForm () {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required' }));
      return;
    }
    if (!formData.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log(response.data);
      setErrors({ email: '', password: '' });

      history.push('/dashboard');
      
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('Incorrect password')) {
          setErrors({ email: '', password: 'Incorrect password' });
        } else if (errorMessage.includes('User not found')) {
          setErrors({ email: 'User not found', password: '' });
        }
      }
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
          <Grid container direction='column' justify='center' alignItems='center'>
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
            >
              Login
            </Button>
            <Link href='#' variant='body2'>
              Forgot password?
            </Link>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default LoginForm;
