import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSelectedAccountId
} from '../redux/selectors/userSelectors';
import {
  setSelectedAccountId
} from '../redux/actions/userActions';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Button,
  useTheme,
  Dialog,
  DialogContent
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import CreateAccountForm from './CreateAccountForm';

const AccountsList = ({
  classes,
  accountsData,
  setSelectedAccount,
  refreshAccounts
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const itemsPerPage = 2;

  const dispatch = useDispatch();
  const selectedAccountId = useSelector(getSelectedAccountId);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleAccountClick = (account) => {
    dispatch(setSelectedAccountId(account.id));
    setSelectedAccount(account);
  };

  const isLastPage = currentPage >= Math.ceil(accountsData.length / itemsPerPage) - 1;
  const displayedAccounts = (accountsData || []).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  if (isLastPage && displayedAccounts.length < 2) {
    displayedAccounts.push(null);
  }

  return (
    <Card className={classes.dashboardCard} elevation={2}>
      <CardContent>
        <Typography
          variant='h5'
          component='h2'
          gutterBottom style={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.primary.main
          }}
        >
          <AccountCircleIcon
            style={{
              marginRight: theme.spacing(1)
            }}
          />
          Accounts
        </Typography>
        {!accountsData || accountsData.length === 0
          ? (
            <Box textAlign='center' color={theme.palette.text.secondary}>
              <Typography variant='body1' gutterBottom>
                You currently have no accounts.
                Click the button below to create a new one.
              </Typography>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                className={classes.createButton}
                onClick={handleOpenCreateDialog}
              >
                Create New Account
              </Button>
            </Box>
            )
          : (
            <>
              <TableContainer
                component={Paper}
                style={{ marginTop: theme.spacing(2) }}
              >
                <Table aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell align='right'>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedAccounts.map((account, index) => (
                      account
                        ? (
                          <TableRow
                            key={account.id || index}
                            hover
                            onClick={() => handleAccountClick(account)}
                            style={{ cursor: 'pointer' }}
                            className={account.id === selectedAccountId ? classes.selectedTableRow : classes.tableRow}
                          >
                            <TableCell component='th' scope='row'>
                              {account.name}
                            </TableCell>
                            <TableCell align='right'>{account.balance}</TableCell>
                          </TableRow>
                          )
                        : (
                          <TableRow key={`empty-${index}`}>
                            <TableCell
                              colSpan={2}
                              style={{
                                backgroundColor: theme.palette.background.default
                              }}
                            >
                              <Box
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                                height='100%'
                              >
                                Empty Slot
                              </Box>
                            </TableCell>
                          </TableRow>
                          )
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                marginTop={theme.spacing(1)}
              >
                <IconButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  size='small'
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography
                  variant='body2'
                  style={{
                    margin: `0 ${theme.spacing(1)}px`
                  }}
                >
                  Page {currentPage + 1} of {Math.ceil(accountsData.length / itemsPerPage)}
                </Typography>
                <IconButton
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  size='small'
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </>
            )}
      </CardContent>
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogContent>
          <CreateAccountForm onAccountCreated={refreshAccounts} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AccountsList;
