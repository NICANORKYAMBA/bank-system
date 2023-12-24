import React from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@material-ui/core';
import styles from './accountDetails.module.css';

function AccountDetails() {
  // Replace these with actual data
  const accountNumber = '1234567890';
  const balance = '5000';
  const accountType = 'Checking';
  const accountStatus = 'Active';
  const accountCreated = '2021-01-01';
  const accountOwner = 'John Doe';
  const accountCurrency = 'USD';
  const transactions = [
    { id: 1, type: 'Deposit', amount: '1000', date: '2022-01-01' },
    { id: 2, type: 'Withdrawal', amount: '500', date: '2022-01-02' },
    // More transactions...
  ];

  return (
    <Container className={styles.container}>
      <Typography variant='h4' component='h1' gutterBottom>
        Account Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Number
              </Typography>
              <Typography color='textSecondary'>
                {accountNumber}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Balance
              </Typography>
              <Typography color='textSecondary'>
                {balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Type
              </Typography>
              <Typography color='textSecondary'>
                {accountType}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Status
              </Typography>
              <Typography color='textSecondary'>
                {accountStatus}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Created
              </Typography>
              <Typography color='textSecondary'>
                {accountCreated}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Owner
              </Typography>
              <Typography color='textSecondary'>
                {accountOwner}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Currency
              </Typography>
              <Typography color='textSecondary'>
                {accountCurrency}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Transaction History
              </Typography>
              {transactions.map(transaction => (
                <Typography key={transaction.id} color='textSecondary'>
                  {transaction.date}: {transaction.type} - {transaction.amount}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AccountDetails;
