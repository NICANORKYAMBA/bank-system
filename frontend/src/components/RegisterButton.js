import React, { useState } from 'react';
import {
  Button,
  makeStyles,
  Dialog,
  Fade,
  CircularProgress
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import RegisterForm from './RegisterForm';

const useStyles = makeStyles((theme) => ({
  registerButton: {
    backgroundColor: 'transparent',
    color: '#1976D2',
    border: '2px solid #1976D2',
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.spacing(1),
    fontSize: '1em',
    marginTop: theme.spacing(1),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#1976D2',
      color: theme.palette.common.white,
      transform: 'scale(1.1)'
    }
  }
}));

function RegisterButton ({ className }) {
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
    <>
      <Button
        variant='contained'
        size='large'
        startIcon={<DescriptionIcon />}
        onClick={handleClickOpen}
        aria-label='Register'
        className={`${classes.registerButton} ${className}`}
      >
        Register
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Fade in={open}>
          <div>
            {loading
              ? (
                <CircularProgress />
                )
              : (
                <RegisterForm handleClose={handleClose} handleSubmit={handleSubmit} />
                )}
          </div>
        </Fade>
      </Dialog>
    </>
  );
}

export default RegisterButton;
