import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllAccountsDataThunk,
  resetUserState
} from '../redux/actions/userActions';
import {
  getUserId
} from '../redux/selectors/userSelectors';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Dialog,
  useTheme,
  useMediaQuery,
  Hidden
} from '@material-ui/core';
import { useDashboard } from '../api/useDashboard';
import CreateAccountForm from './CreateAccountForm';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import PaymentIcon from '@material-ui/icons/Payment';
import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    height: '100%'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0),
    position: 'fixed',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    minWidth: 240,
    height: '100%'
  },
  drawerPaper: {
    minWidth: 240
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }

}));

const Navigation = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userId = useSelector(getUserId);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    handleDrawerOpen,
    handleDrawerClose,
    open: drawerOpen
  } = useDashboard();

  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  const handleCreateAccountOpen = () => {
    setCreateAccountOpen(true);
  };

  const handleCreateAccountClose = () => {
    setCreateAccountOpen(false);
  };

  const handleAccountCreation = () => {
    dispatch(fetchAllAccountsDataThunk(userId));
  };


  const handleLogout = () => {
    dispatch(resetUserState());

    sessionStorage.clear();

    window.location.href = '/';
  };

  const navItems = (
    <List component='nav'>
      <ListItem
        button key='Home'
        component={Link} to='/'>
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary='Home' />
      </ListItem>
      <ListItem
        button key='Dashboard'
        component={Link} to='/dashboard'>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem
        button key='Account Overview'
        component={Link} to='/account-overview'>
        <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
        <ListItemText primary='Account Overview' />
      </ListItem>
      <ListItem
        button key='Transactions'
        component={Link} to='/transactions'>
        <ListItemIcon><ListIcon /></ListItemIcon>
        <ListItemText primary='Transactions' />
      </ListItem>
      <ListItem
        button key='Create Account'
        onClick={handleCreateAccountOpen}>
        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
        <ListItemText primary='Create Account' />
      </ListItem>
      <ListItem
        button key='Activate Account'
        component={Link} to='/activate-account'>
        <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
        <ListItemText primary='Activate Account' />
      </ListItem>
      <ListItem button key='Schedule Payments'>
        <ListItemIcon><PaymentIcon /></ListItemIcon>
        <ListItemText primary='Schedule Payments' />
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
      <ListItem
        button key='Profile Management'
        component={Link} to='/profile-management'
      >
        <ListItemIcon><AccountCircle /></ListItemIcon>
        <ListItemText primary='Profile Management' />
      </ListItem>
      <ListItem
        button key='Logout'
        onClick={handleLogout}
      >
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItem>
    </List>
  );

  return (
    <div className={classes.root}>
      <Hidden smUp implementation='css'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
          className={classes.menuButton}
          style={{ display: 'inherit' }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          className={classes.drawer}
          variant='temporary'
          anchor='left'
          open={drawerOpen}
          onClose={handleDrawerClose}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {navItems}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {navItems}
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        {isMobile
          ? (
            <>
              {!drawerOpen && (
                <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  onClick={handleDrawerOpen}
                  edge='start'
                  className={classes.menuButton}
                  style={{ display: isMobile && drawerOpen ? 'none' : 'inherit' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='left'
                open={drawerOpen}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={(event, reason) => {
                  if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    handleDrawerClose();
                  }
                }}
              >
                <div className={classes.toolbar}>
                  <IconButton onClick={handleDrawerClose}>
                    <MenuIcon />
                  </IconButton>
                </div>
              </Drawer>
            </>
            )
          : null}
      </main>
      <Dialog
        open={createAccountOpen}
        onClose={handleCreateAccountClose}
        aria-labelledby='form-dialog-title'
      >
        <CreateAccountForm onAccountCreated={handleAccountCreation} />
      </Dialog>
    </div>
  );
};

export default Navigation;
