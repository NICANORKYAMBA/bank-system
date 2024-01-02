import React from 'react';
import { Grid, Typography, Box, TextField, Button, IconButton, Badge, Avatar, Popover } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';

const DashboardHeader = ({ classes, userData, handleProfilePopoverOpen, profileOpen, profileAnchorEl, handleProfilePopoverClose }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant='h4' component='h1' gutterBottom style={{ marginLeft: '20px' }}>
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Box display='flex' justifyContent='flex-end' alignItems='center' style={{ marginLeft: '20px' }}>
          <TextField
            variant='outlined'
            placeholder='Search transactions'
            InputProps={{
              startAdornment: <SearchIcon />
            }}
          />
          <Button variant='contained' color='primary' className={classes.button}>
            Filter
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge='end'
            aria-label='user profile'
            color='inherit'
            onClick={handleProfilePopoverOpen}
          >
            <Avatar alt='User Profile' src='https://via.placeholder.com/150' />
          </IconButton>
          <Popover
            id='profile-popover'
            open={profileOpen}
            anchorEl={profileAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            onClose={handleProfilePopoverClose}
            disableRestoreFocus
          >
            <Typography>
              User details go here
            </Typography>
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
