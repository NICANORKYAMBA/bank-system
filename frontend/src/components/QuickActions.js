import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  showDepositForm,
  hideDepositForm,
  showTransferForm,
  hideTransferForm,
  showWithdrawalForm,
  hideWithdrawalForm
} from '../redux/actions/QuickActions';
import {
  getUserAccountsData
} from '../redux/selectors/userSelectors';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogContent,
  makeStyles,
  Tooltip
} from '@material-ui/core';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';
import BillIcon from '@material-ui/icons/Receipt';
import clsx from 'clsx';
import DepositForm from './DepositForm';
import TransferForm from './TransferForm';
import WithdrawalForm from './WithdrawalForm';

const useStyles = makeStyles((theme) => ({
  dashboardCard: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    },
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary
  },
  dashboardCardContent: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  },
  dashboardButton: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    fontSize: '0.7rem',
    fontWeight: 500,
    boxShadow: theme.shadows[1],
    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)'
    },
    width: '100%'
  },
  depositButton: {
    backgroundColor: theme.palette.success.light,
    '&:hover': {
      backgroundColor: theme.palette.success.main
    }
  },
  transferButton: {
    backgroundColor: theme.palette.info.light,
    '&:hover': {
      backgroundColor: theme.palette.info.main
    }
  },
  withdrawButton: {
    backgroundColor: theme.palette.warning.light,
    '&:hover': {
      backgroundColor: theme.palette.warning.main
    }
  },
  billButton: {
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  },
  dialogContent: {
    padding: theme.spacing(2)
  }
}));

const QuickActions = ({
  onTransactionCreated
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const accountsData = useSelector(getUserAccountsData);

  const showDepositFormState = useSelector(state => state.quick.showDepositForm);
  const showTransferFormState = useSelector(state => state.quick.showTransferForm);
  const showWithdrawalFormState = useSelector(state => state.quick.showWithdrawalForm);

  return (
    <Card className={classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography
          variant='h6'
          component='h2'
          gutterBottom style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {/* Deposit Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip
              title={!accountsData || accountsData.length === 0
                ? 'You need to have at least one account to perform this action.'
                : ''}
            >
              <span>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<DepositIcon />}
                  className={clsx(classes.dashboardButton, classes.depositButton)}
                  onClick={() => {
                    dispatch(showDepositForm());
                  }}
                  disabled={!accountsData || accountsData.length === 0}
                >
                  Deposit
                </Button>
              </span>
            </Tooltip>
            <Dialog
              open={showDepositFormState}
              onClose={() => dispatch(hideDepositForm())}
            >
              <DialogContent className={classes.dialogContent}>
                <DepositForm
                  handleClose={() => dispatch(hideDepositForm())}
                  onTransactionCreated={onTransactionCreated}
                />
              </DialogContent>
            </Dialog>
          </Grid>
          {/* Transfer Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip
              title={!accountsData || accountsData.length === 0
                ? 'You need to have at least one account to perform this action.'
                : ''}
            >
              <span>
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<TransferIcon />}
                  className={clsx(classes.dashboardButton, classes.transferButton)}
                  onClick={() => {
                    dispatch(showTransferForm());
                  }}
                  disabled={!accountsData || accountsData.length === 0}
                >
                  Transfer
                </Button>
              </span>
            </Tooltip>
            <Dialog
              open={showTransferFormState}
              onClose={() => dispatch(hideTransferForm())}
            >
              <DialogContent className={classes.dialogContent}>
                <TransferForm
                  handleClose={() => dispatch(hideTransferForm())}
                  onTransactionCreated={onTransactionCreated}
                />
              </DialogContent>
            </Dialog>
          </Grid>
          {/* Withdrawal Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip
              title={!accountsData || accountsData.length === 0
                ? 'You need to have at least one account to perform this action.'
                : ''}
            >
              <span>
                <Button
                  variant='contained'
                  startIcon={<WithdrawIcon />}
                  className={clsx(classes.dashboardButton, classes.withdrawButton)}
                  onClick={() => {
                    dispatch(showWithdrawalForm());
                  }}
                  disabled={!accountsData || accountsData.length === 0}
                >
                  Withdraw
                </Button>
              </span>
            </Tooltip>
            <Dialog
              open={showWithdrawalFormState}
              onClose={() => dispatch(hideWithdrawalForm())}
            >
              <DialogContent className={classes.dialogContent}>
                <WithdrawalForm
                  handleClose={() => dispatch(hideWithdrawalForm())}
                  onTransactionCreated={onTransactionCreated}
                />
              </DialogContent>
            </Dialog>
          </Grid>
          {/* Pay a Bill Button */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip
              title={!accountsData || accountsData.length === 0
                ? 'You need to have at least one account to perform this action.'
                : ''}
            >
              <span>
                <Button
                  variant='contained'
                  startIcon={<BillIcon />}
                  className={clsx(classes.dashboardButton, classes.billButton)}
                  disabled={!accountsData || accountsData.length === 0}
                >
                  Pay a Bill
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
