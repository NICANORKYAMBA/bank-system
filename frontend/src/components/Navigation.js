import React from 'react';
import {
  Button,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
  Link,
  Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AccountCircle from '@material-ui/icons/AccountCircle';

const Navigation = ({ classes, handleDrawerOpen, handleDrawerClose, handleMenuOpen, handleMenuClose, anchorEl, open }) => {
  return (
    <>
      <Hidden smUp implementation='css'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
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
          <div>
            <IconButton onClick={handleDrawerClose}>
              <Typography variant='h6'>
                General
              </Typography>
              <Link component='button' variant='body2' onClick={() => { console.log('Profile Management clicked'); }}>
                Profile Management
              </Link>
              <Button color='inherit' startIcon={<ExitToAppIcon />}>
                Logout
              </Button>
            </IconButton>
          </div>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation='css'>
        <AppBar position='static' className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-around' style={{ height: '100%' }}>
              <Typography variant='h6' className={classes.title}>
                General
              </Typography>
              <IconButton
                edge='end'
                aria-label='help'
                color='inherit'
                onClick={() => { console.log('Help clicked'); }}
              >
                <HelpOutlineIcon />
              </IconButton>
              <Link component='button' variant='body2' onClick={() => { console.log('Contact Information clicked'); }} style={{ color: '#fff' }}>
                Contact Information
              </Link>
            </Box>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              onClick={handleMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile Management</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Hidden>
    </>
  );
};

export default Navigation;
