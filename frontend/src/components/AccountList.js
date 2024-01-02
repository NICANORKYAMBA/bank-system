import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const AccountsList = ({
  classes,
  accountsData,
  setSelectedAccount,
  scrollAccounts,
  accountsScrollContainerRef
}) => {
  return (
    <Card className={`${classes.dashboardCard} ${classes.accountsCard}`}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom className={classes.accountsTitle}>
          Accounts
        </Typography>
        <div ref={accountsScrollContainerRef} style={{ overflowX: 'auto', overflowY: 'hidden', display: 'flex', height: '200px' }}>
          {accountsData
            ? (
                accountsData.map((account, index) => (
                  <div style={{ flex: '0 0 auto', width: '100%' }} key={index}>
                    <Card variant='outlined' className={classes.accountCard} onClick={() => setSelectedAccount(account)}>
                      <CardContent>
                        <Typography variant='h5' component='h2' className={classes.accountName} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976D2' }}>
                          {account.name}
                        </Typography>
                        <Typography color='textSecondary' style={{ marginTop: '10px', color: '#3f51b5' }}>
                          Balance: {account.balance}
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )
            : (
              <Typography color='textSecondary'>
                Loading accounts...
              </Typography>
              )}
        </div>
        <Button onClick={() => scrollAccounts(-430)}>
          <ArrowBackIosIcon />
        </Button>
        <Button onClick={() => scrollAccounts(430)}>
          <ArrowForwardIosIcon />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountsList;
