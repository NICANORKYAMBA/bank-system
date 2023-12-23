import React, { useState } from 'react';
import { Button, Container, Typography, Grid, Box, Tooltip, Dialog, DialogContent } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DescriptionIcon from '@material-ui/icons/Description';
import styles from './Home.module.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function Home () {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };
  
  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <Box className={styles.homeContainer}>
      <Container className={styles.homeContent} maxWidth={false}>
        <Grid container spacing={3} alignItems='center' justifyContent='center'>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Tooltip title='Bank Icon'>
              <AccountBalanceIcon className={styles.homeIcon} fontSize='inherit' />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Typography variant='h4' component='h1' gutterBottom>
              Welcome to FinTrust Bank
            </Typography>
            <Typography variant='body1' paragraph>
              Your trusted partner for secure and efficient banking services. We prioritize your financial well-being and offer a range of solutions to meet your needs.
            </Typography>
            <Button
              className={styles.homeButton}
              variant='contained'
              size='large'
              startIcon={<AccountBalanceIcon />}
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button
              className={styles.homeButtonOutlined}
              variant='outlined'
              size='large'
              startIcon={<DescriptionIcon />}
              onClick={handleRegisterClick}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth={false} className={styles.homeFeatureSection}>
        <Grid container spacing={3} alignItems='center' justifyContent='center'>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Tooltip title='Personalized Banking'>
              <MonetizationOnIcon className={styles.homeFeatureIcon} />
            </Tooltip>
            <Typography variant='h6' gutterBottom>
              Personalized Banking
            </Typography>
            <Typography variant='body2'>
              Tailored financial solutions to meet your unique needs.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Tooltip title='Secure Transactions'>
              <CreditCardIcon className={styles.homeFeatureIcon} />
            </Tooltip>
            <Typography variant='h6' gutterBottom>
              Secure Transactions
            </Typography>
            <Typography variant='body2'>
              Enjoy safe and secure online transactions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Tooltip title='Transparent Services'>
              <DescriptionIcon className={styles.homeFeatureIcon} />
            </Tooltip>
            <Typography variant='h6' gutterBottom>
              Transparent Services
            </Typography>
            <Typography variant='body2'>
              Clear and transparent communication about our services.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={showLogin} onClose={handleClose}>
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
      <Dialog open={showRegister} onClose={handleClose}>
        <DialogContent>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Home;
