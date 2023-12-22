import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Link to="/" className={styles.title}>
          <AccountBalanceIcon className={styles.icon} />
          <Typography variant="h6" noWrap>
            FinTrust Bank
          </Typography>
        </Link>
        <div>
          <Button color="inherit" component={Link} to="/login" className={styles.button}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register" className={styles.button}>
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;