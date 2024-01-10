import React from 'react';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import { Container, makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(4, 0),
    padding: theme.spacing(1),
    backgroundColor: '#f5f5f5'
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function AuthButtonsContainer () {
  const classes = useStyles();

  return (
    <Container maxWidth='sm'>
      <Paper className={classes.buttonContainer} elevation={0}>
        <LoginButton className={classes.button} />
        <RegisterButton className={classes.button} />
      </Paper>
    </Container>
  );
}

export default AuthButtonsContainer;
