import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  CardContent,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PersonIcon from '@material-ui/icons/Person';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green, red } from '@material-ui/core/colors';

const AccountSummary = ({ classes, selectedAccount }) => {
  const theme = useTheme();
  const loading = useSelector(state => state.dashboard.loading);

  useEffect(() => {
  }, [selectedAccount]);

  const iconColor = theme.palette.text.secondary;

  const listItemStyle = (isNegative) => ({
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isNegative ? red[50] : green[50]
  });

  const listItemTextStyle = {
    marginBottom: '0px'
  };

  return (
    <Paper className={classes.dashboardCard} elevation={2}>
      <CardContent>
        <Typography variant='h6' component='h2' gutterBottom style={{ paddingBottom: theme.spacing(0) }}>
          Account Summary
        </Typography>
        {loading
          ? (
            <CircularProgress />
            )
          : (
              selectedAccount && selectedAccount !== null
                ? (
                  <List dense>
                    <ListItem style={listItemStyle()}>
                      <ListItemIcon>
                        <AccountBalanceIcon color={iconColor} />
                      </ListItemIcon>
                      <ListItemText primary='Account Number' secondary={selectedAccount.accountNumber} style={listItemTextStyle} />
                    </ListItem>
                    <ListItem style={listItemStyle()}>
                      <ListItemIcon>
                        <PersonIcon color={iconColor} />
                      </ListItemIcon>
                      <ListItemText primary='Name' secondary={selectedAccount.name} style={listItemTextStyle} />
                    </ListItem>
                    <ListItem style={listItemStyle(selectedAccount.balance < 0)}>
                      <ListItemIcon>
                        <AttachMoneyIcon color={iconColor} />
                      </ListItemIcon>
                      <ListItemText primary='Balance' secondary={selectedAccount.balance} style={listItemTextStyle} />
                    </ListItem>
                    <ListItem style={listItemStyle()}>
                      <ListItemIcon>
                        <AccountBalanceWalletIcon color={iconColor} />
                      </ListItemIcon>
                      <ListItemText primary='Account Type' secondary={selectedAccount.accountType} style={listItemTextStyle} />
                    </ListItem>
                    <ListItem style={listItemStyle()}>
                      <ListItemIcon>
                        <MonetizationOnIcon color={iconColor} />
                      </ListItemIcon>
                      <ListItemText primary='Currency' secondary={selectedAccount.currency} style={listItemTextStyle} />
                    </ListItem>
                    <ListItem style={listItemStyle()}>
                      <ListItemIcon>
                        {selectedAccount.status === 'active' ? <CheckCircleOutlineIcon style={{ color: green[500] }} /> : <HighlightOffIcon color='error' />}
                      </ListItemIcon>
                      <ListItemText primary='Status' secondary={selectedAccount.status} style={listItemTextStyle} />
                    </ListItem>
                  </List>
                  )
                : (
                  <Typography color='textSecondary'>
                    Click an account to see its summary.
                  </Typography>
                  )
            )}
      </CardContent>
    </Paper>
  );
};

export default AccountSummary;
