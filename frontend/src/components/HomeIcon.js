import React from 'react';
import { Box, Tooltip, makeStyles, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 150,
    backgroundColor: '#1976D2',
    borderRadius: '50%',
    boxShadow: '0 6px 12px 0 rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.15)',
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.3)'
    },
    margin: theme.spacing(2)
  },
  icon: {
    color: theme.palette.common.white,
    fontSize: 70
  },
  tooltip: {
    fontSize: 14
  },
  iconLabel: {
    textAlign: 'center',
    marginTop: theme.spacing(1),
    fontWeight: 'bold',
    color: theme.palette.common.black
  }
}));

const HomeIcon = () => {
  const classes = useStyles();

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Tooltip title='Go to Home Page' classes={{ tooltip: classes.tooltip }}>
        <Box className={classes.iconContainer}>
          <AccountBalanceIcon className={classes.icon} />
        </Box>
      </Tooltip>
      <Typography variant='subtitle1' className={classes.iconLabel}>
        Home
      </Typography>
    </Box>
  );
};

export default HomeIcon;
