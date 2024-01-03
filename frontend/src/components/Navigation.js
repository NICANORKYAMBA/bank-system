import React from 'react';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Badge
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import PaymentIcon from '@material-ui/icons/Payment';
import SettingsIcon from '@material-ui/icons/Settings';

const Navigation = ({
  classes,
  handleDrawerOpen,
  handleDrawerClose,
  handleMenuOpen,
  handleMenuClose,
  anchorEl,
  open
}) => {
  return (
    <div className={classes.root}>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        onClick={handleDrawerOpen}
        edge='start'
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key='Account Overview'>
            <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
            <ListItemText primary='Account Overview' />
          </ListItem>
          <ListItem button key='Transactions'>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary='Transactions' />
          </ListItem>
          <ListItem button key='Transfer Funds'>
            <ListItemIcon><SwapHorizIcon /></ListItemIcon>
            <ListItemText primary='Transfer Funds' />
          </ListItem>
          <ListItem button key='Bill Payments'>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary='Bill Payments' />
          </ListItem>
          <ListItem button key='Settings'>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItem>
          <ListItem button key='Profile Management' onClick={() => { console.log('Profile Management clicked'); }}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary='Profile Management' />
          </ListItem>
          <ListItem button key='Logout'>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
        <Divider />
        <Box className={classes.search}>
          <Box className={classes.searchIcon}>
            <SearchIcon />
          </Box>
          <input
            placeholder='Search…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        <IconButton color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Drawer>
    </div>
  );
};

export default Navigation;
