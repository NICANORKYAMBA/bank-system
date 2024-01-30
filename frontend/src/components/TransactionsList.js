import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Chip,
  Avatar,
  useMediaQuery,
  Box
} from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DepositIcon from '@material-ui/icons/AccountBalanceWallet';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import WithdrawIcon from '@material-ui/icons/MoneyOff';

const useStyles = makeStyles((theme) => ({
  dashboardCard: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  dashboardCardContent: {
    padding: theme.spacing(3)
  },
  transactionCard: {
    flex: '0 0 auto',
    margin: theme.spacing(2),
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: theme.spacing(45),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[10]
    }
  },
  transactionChip: {
    margin: theme.spacing(1, 0),
    '& .MuiChip-avatar': {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main
    }
  },
  transactionDetails: {
    color: theme.palette.text.primary,
    fontSize: '0.875rem'
  },
  scrollButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  }
}));

const TransactionsList = ({
  transactions,
  selectedAccount,
  transactionsScrollContainerRef
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;

  useEffect(() => {
    setCurrentPage(0);
    if (transactionsScrollContainerRef.current) {
      transactionsScrollContainerRef.current.scrollTo(0, 0);
    }
  }, [selectedAccount, transactionsScrollContainerRef]);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.sourceAccountId === selectedAccount?.id ||
    transaction.destinationAccountId === selectedAccount?.id
  );

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const isLastPage = currentPage >= Math.ceil(filteredTransactions.length / itemsPerPage) - 1;
  const displayedTransactions = (filteredTransactions || []).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <DepositIcon />;
      case 'withdrawal':
        return <WithdrawIcon />;
      default:
        return <TransferIcon />;
    }
  };

  return (
    <Card className={isMobile ? classes.mobileDashboardCard : classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography
          variant='h6'
          component='h2'
          gutterBottom style={{ fontFamily: 'Poppins, sans-serif', color: theme.palette.primary.dark }}
        >
          Transactions
        </Typography>
        <div
          ref={transactionsScrollContainerRef}
          style={{ overflowX: 'auto', display: 'flex' }}
        >
          {displayedTransactions.length > 0
            ? (
                displayedTransactions.map((transaction, index) => (
                  <Paper elevation={3} className={classes.transactionCard} key={index}>
                    <CardContent>
                      <Chip
                        avatar={<Avatar>{getTransactionIcon(transaction.type)}</Avatar>}
                        label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        className={classes.transactionChip}
                      />
                      <Typography className={classes.transactionDetails}>
                        Amount: {transaction.amount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Source Account: {transaction.sourceAccount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Destination Account: {transaction.destinationAccount}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Description: {transaction.description}
                      </Typography>
                      <Typography className={classes.transactionDetails}>
                        Date: {new Date(transaction.transactionDate).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Paper>
                ))
              )
            : (
              <Typography color='textSecondary'>
                Welcome! Your transactions will appear here when you make one.
              </Typography>
              )}
        </div>
        {displayedTransactions.length > 0 && (
          <Box display='flex' justifyContent='center' alignItems='center' marginTop={theme.spacing(1)}>
            <IconButton onClick={handlePrevPage} disabled={currentPage === 0} size='small'>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant='body2' style={{ margin: `0 ${theme.spacing(1)}px` }}>
              Page {currentPage + 1} of {Math.ceil(transactions.length / itemsPerPage)}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={isLastPage} size='small'>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
