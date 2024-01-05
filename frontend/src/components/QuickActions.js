import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogContent
} from '@material-ui/core';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';
import BillIcon from '@material-ui/icons/Receipt';
import DepositForm from './DepositForm';
import TransferForm from './TransferForm';
import WithdrawalForm from './WithdrawalForm';

const QuickActions = ({
  classes,
  accountsData,
  handleDepositClick,
  handleTransferClick,
  handleWithdrawalClick,
  showDepositForm,
  showTransferForm,
  showWithdrawalForm,
  handleCloseDeposit,
  handleClose,
  handleCloseWithdrawal
}) => {
  return (
    <Card className={classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<DepositIcon />}
              className={`${classes.dashboardButton} ${classes.depositButton}`}
              onClick={handleDepositClick}
              disabled={!accountsData || accountsData.length === 0}
            >
              Deposit
            </Button>
            <Dialog open={showDepositForm} onClose={handleCloseDeposit}>
              <DialogContent>
                <DepositForm handleClose={handleCloseDeposit} />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<TransferIcon />}
              className={`${classes.dashboardButton} ${classes.transferButton}`}
              onClick={handleTransferClick}
              disabled={!accountsData || accountsData.length === 0}
            >
              Transfer
            </Button>
            <Dialog open={showTransferForm} onClose={handleClose}>
              <DialogContent>
                <TransferForm handleClose={handleClose} />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='default'
              startIcon={<WithdrawIcon />}
              className={`${classes.dashboardButton} ${classes.withdrawButton}`}
              onClick={handleWithdrawalClick}
              disabled={!accountsData || accountsData.length === 0}
            >
              Withdrawal
            </Button>
            <Dialog open={showWithdrawalForm} onClose={handleCloseWithdrawal}>
              <DialogContent>
                <WithdrawalForm handleClose={handleCloseWithdrawal} />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='inherit'
              startIcon={<BillIcon />}
              className={`${classes.dashboardButton} ${classes.billButton}`}
              disabled={!accountsData || accountsData.length === 0}
            >
              Pay a Bill
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
