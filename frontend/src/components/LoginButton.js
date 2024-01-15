import React, { useState } from 'react';
import {
  Button,
  Dialog,
  makeStyles,
  CircularProgress,
  Fade
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme) => ({
  loginButton: {
    backgroundColor: '#1976D2',
    color: theme.palette.common.white,
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(1),
    fontSize: '1em',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#135895',
      transform: 'scale(1.1)'
    }
  }
}));

function LoginButton ({ className }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleClose();
    }, 2000);
  };

  return (
    <div>
      <Button
        variant='contained'
        size='large'
        startIcon={<AccountBalanceIcon />}
        onClick={handleClickOpen}
        aria-label='Login'
        className={`${classes.loginButton} ${className}`}
      >
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        closeAfterTransition
      >
        <Fade in={open}>
          <div>
            {loading
              ? (
                <CircularProgress />
                )
              : (
                <LoginForm handleClose={handleClose} handleSubmit={handleSubmit} />
                )}
          </div>
        </Fade>
      </Dialog>
    </div>
  );
}

export default LoginButton;
