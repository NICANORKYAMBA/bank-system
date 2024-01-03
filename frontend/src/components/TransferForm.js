import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import * as ReactSpring from 'react-spring';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
    borderRadius: '5px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s'
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 500,
    '& label.Mui-focused': {
      color: '#1976D2',
      fontSize: '1rem'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1976D2'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1976D2'
      }
    }
  },
  formButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 300,
    backgroundColor: '#1976D2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#135895'
    },
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  title: {
    marginBottom: theme.spacing(2),
    color: '#1976D2',
    fontSize: '2rem'
  }
}));

const TransferForm = ({ handleClose }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    type: 'transfer',
    amount: '',
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    description: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      ...formData,
      userId: sessionStorage.getItem('userId')
    };

    try {
      const response = await axios.post('http://localhost:5000/api/transactions', data);
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const props = ReactSpring.useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <ReactSpring.animated.div style={props}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography className={classes.title}>Transfer Form</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className={classes.formControl}
              label='Amount'
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.formControl}
              label='Source Account Number'
              type='text'
              name='sourceAccountNumber'
              value={formData.sourceAccountNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.formControl}
              label='Destination Account Number'
              type='text'
              name='destinationAccountNumber'
              value={formData.destinationAccountNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.formControl}
              label='Description'
              type='text'
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.formButton}
              variant='contained'
              color='primary'
              type='submit'
            >
              Initiate Transfer
            </Button>
          </Grid>
        </Grid>
      </form>
    </ReactSpring.animated.div>
  );
};

export default TransferForm;
