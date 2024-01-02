import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const AccountSummary = ({ classes, selectedAccount }) => {
  return (
    <Card className={`${classes.dashboardCard} ${classes.summaryCard}`}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom className={classes.summaryTitle} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976D2' }}>
          Account Summary
        </Typography>
        {selectedAccount
          ? (
            <>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', color: '#3f51b5' }}>
                <strong>Account Number:</strong> {selectedAccount.accountNumber}
              </Typography>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', color: '#3f51b5' }}>
                <strong>Name:</strong> {selectedAccount.name}
              </Typography>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', backgroundColor: selectedAccount.balance < 0 ? '#FFCDD2' : '#C8E6C9', color: selectedAccount.balance < 0 ? 'red' : 'green' }}>
                <strong>Balance:</strong> {selectedAccount.balance}
              </Typography>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', color: '#3f51b5' }}>
                <strong>Account Type:</strong> {selectedAccount.accountType}
              </Typography>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', color: '#3f51b5' }}>
                <strong>Currency:</strong> {selectedAccount.currency}
              </Typography>
              <Typography className={classes.summaryDetail} style={{ marginTop: '10px', backgroundColor: selectedAccount.status === 'active' ? '#C8E6C9' : '#FFCDD2', color: selectedAccount.status === 'active' ? 'green' : 'red' }}>
                <strong>Status:</strong> {selectedAccount.status}
              </Typography>
            </>
            )
          : (
            <Typography color='textSecondary'>
              Click an account to see its summary.
            </Typography>
            )}
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
