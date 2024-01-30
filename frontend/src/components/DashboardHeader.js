import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector } from 'react-redux';
import {
  getUserFirstName,
  getUserLastName
} from '../redux/selectors/userSelectors';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '140%'
  },
  greeting: {
    fontWeight: 400,
    color: theme.palette.primary.dark
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(-2),
    padding: theme.spacing(2),
    width: '100%'
  },
  searchInput: {
    marginRight: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius
    }
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none'
    },
    backgroundColor: '#007BFF',
    color: '#FFFFFF'
  }
}));

const DashboardHeader = ({
  handleSearchChange,
  handleSearchSubmit
}) => {
  const firstName = useSelector(getUserFirstName);
  const lastName = useSelector(getUserLastName);
  const classes = useStyles();
  const [searchCategory, setSearchCategory] = useState('all');

  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  return (
    <Grid
      container spacing={3}
      className={classes.headerContainer}
    >
      <Grid item xs={12} sm={5} md={4}>
        <Typography
          variant='h5'
          component='h1'
          className={classes.greeting}
        >
          Hello, {firstName && lastName ? `${firstName} ${lastName}` : 'Loading...'}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Box className={classes.searchBox}>
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', width: '100%' }}
          >
            <Select
              value={searchCategory}
              onChange={handleSearchCategoryChange}
              className={classes.searchInput}
            >
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
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.button}
            >
              Filter
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
