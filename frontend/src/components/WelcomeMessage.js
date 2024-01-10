import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Container, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  welcomeContainer: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  welcomeTitle: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem'
  },
  welcomeSubtitle: {
    color: theme.palette.secondary.main,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    fontSize: '1.5rem'
  },
  welcomeText: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
    fontSize: '1rem'
  },
  welcomeButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2, 4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));

function WelcomeMessage () {
  const classes = useStyles();

  return (
    <Container className={classes.welcomeContainer}>
      <Grid container spacing={3} justifyContent='center' alignItems='center'>
        <Grid item xs={12}>
          <Typography variant='h2' className={classes.welcomeTitle}>
            Welcome to FinTrust
          </Typography>
          <Typography variant='h6' className={classes.welcomeSubtitle}>
            Your trusted partner in financial success
          </Typography>
          <Typography variant='body1' className={classes.welcomeText}>
            Explore our services and find out how we can help you achieve your financial goals.
          </Typography>
          <Button
            variant='contained'
            className={classes.welcomeButton}
            component={Link}
            to='/registration'
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default WelcomeMessage;
