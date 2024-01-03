import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Badge,
  Avatar,
  Popover,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';

const DashboardHeader = ({
  classes,
  userData,
  handleProfilePopoverOpen,
  profileOpen,
  profileAnchorEl,
  handleProfilePopoverClose,
  handleSearchChange,
  handleSearchSubmit,
  notificationsCount,
  handleNotificationsClick,
  notifications
}) => {
  const [searchType, setSearchType] = useState('all');

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant='h4' component='h1' gutterBottom style={{ marginLeft: '20px' }} className={classes.greeting}>
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : <CircularProgress size={24} />}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='row'>
          <form onSubmit={handleSearchSubmit}>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Select value={searchType} onChange={handleSearchTypeChange}>
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='deposits'>Deposits</MenuItem>
                <MenuItem value='withdrawals'>Withdrawals</MenuItem>
                <MenuItem value='transfers'>Transfers</MenuItem>
              </Select>
              <TextField
                variant='outlined'
                placeholder='Search transactions'
                InputProps={{
                  startAdornment: <SearchIcon />
                }}
                onChange={handleSearchChange}
              />
              <Button type='submit' variant='contained' color='primary' className={classes.button}>
                Filter
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Tooltip title='Notifications'>
            <IconButton color='inherit' onClick={handleNotificationsClick}>
              <Badge badgeContent={notificationsCount} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Add a component to display notifications when the icon is clicked */}
          <Tooltip title='User Profile'>
            <IconButton
              edge='end'
              aria-label='user profile'
              color='inherit'
              onClick={handleProfilePopoverOpen}
            >
              <Avatar alt='User Profile' src='https://via.placeholder.com/150' />
            </IconButton>
          </Tooltip>
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
              Email: {userData.email}<br />
              Phone: {userData.phone}
              {/* Display more user details as needed */}
            </Typography>
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
