import React from 'react';
import { Button, Container, Typography, Grid, Box } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DescriptionIcon from '@material-ui/icons/Description';
import styles from './Home.module.css';

function Home() {
  return (
    <Box className={styles.homeContainer}>
      <Container className={styles.homeContent} maxWidth={false}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AccountBalanceIcon className={styles.homeIcon} fontSize="inherit" />
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to FinTrust Bank
            </Typography>
            <Typography variant="body1" paragraph>
              Your trusted partner for secure and efficient banking services. We prioritize your financial well-being and offer a range of solutions to meet your needs.
            </Typography>
            <Button
              className={styles.homeButton}
              variant="contained"
              size="large"
              startIcon={<AccountBalanceIcon />}
            >
              Login
            </Button>
            <Button
              className={styles.homeButtonOutlined}
              variant="outlined"
              size="large"
              startIcon={<DescriptionIcon />}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth={false} className={styles.homeFeatureSection}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <MonetizationOnIcon className={styles.homeFeatureIcon} />
            <Typography variant="h6" gutterBottom>
              Personalized Banking
            </Typography>
            <Typography variant="body2">
              Tailored financial solutions to meet your unique needs.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CreditCardIcon className={styles.homeFeatureIcon} />
            <Typography variant="h6" gutterBottom>
              Secure Transactions
            </Typography>
            <Typography variant="body2">
              Enjoy safe and secure online transactions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DescriptionIcon className={styles.homeFeatureIcon} />
            <Typography variant="h6" gutterBottom>
              Transparent Services
            </Typography>
            <Typography variant="body2">
              Clear and transparent communication about our services.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;