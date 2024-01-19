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
  Select,
  MenuItem,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { useUserContext } from './userContext';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '100%'
  },
  greeting: {
    fontWeight: 400,
    color: theme.palette.primary.dark
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(-2),
    padding: theme.spacing(1),
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  },
  searchInput: {
    marginRight: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius
    }
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  popoverContent: {
    padding: theme.spacing(2)
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none'
    }
  }
}));

const DashboardHeader = ({
  handleProfilePopoverOpen,
  profileOpen,
  profileAnchorEl,
  handleProfilePopoverClose,
  handleSearchChange,
  handleSearchSubmit,
  notificationsCount,
  handleNotificationsClick
}) => {
  const { userData } = useUserContext();
  const classes = useStyles();
  const [searchCategory, setSearchCategory] = useState('all');

  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  return (
    <Grid container spacing={3} className={classes.headerContainer}>
      <Grid item xs={12} sm={5} md={4}>
        <Typography variant='h5' component='h1' className={classes.greeting}>
          Hello, {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Box className={classes.searchBox}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
            <Select value={searchCategory} onChange={handleSearchCategoryChange} className={classes.searchInput}>
              <MenuItem value='all'>All</MenuItem>
              <MenuItem value='deposits'>Deposits</MenuItem>
              <MenuItem value='withdrawals'>Withdrawals</MenuItem>
              <MenuItem value='transfers'>Transfers</MenuItem>
            </Select>
            <TextField
              variant='outlined'
              placeholder='Search transactions'
              fullWidth
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleSearchChange}
            />
            <Button type='submit' variant='contained' color='primary' className={classes.button}>
              Filter
            </Button>
          </form>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3} md={4}>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Tooltip title='Notifications'>
            <IconButton color='inherit' onClick={handleNotificationsClick} aria-label='Notifications'>
              <Badge badgeContent={notificationsCount} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title='User Profile'>
            <IconButton
              edge='end'
              aria-label='User Profile'
              color='inherit'
              onClick={handleProfilePopoverOpen}
            >
              <Avatar alt='User Profile' src={userData?.profilePicture || <PersonOutlineIcon />} className={classes.avatar} />
            </IconButton>
          </Tooltip>
          <Popover
            id='profile-popover'
            open={profileOpen}
            anchorEl={profileAnchorEl}
            onClose={handleProfilePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Box className={classes.popoverContent}>
              <Typography>Email: {userData?.email}</Typography>
              <Typography>Phone: {userData?.phone}</Typography>
              {Array.isArray(userData?.addresses)
                ? (
                    userData.addresses.map((address, index) => (
                      address && (
                        <Box key={index}>
                          <Typography>Address {index + 1}:</Typography>
                          <Typography>
                            {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                          </Typography>
                        </Box>
                      )
                    ))
                  )
                : (
                  <Typography>No addresses available.</Typography>
                  )}
            </Box>
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
