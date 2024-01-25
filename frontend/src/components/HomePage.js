import React from 'react';
import {
  Container,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HomeIcon from './HomeIcon';
import AuthButtonsContainer from './AuthButtonsContainer';
import FeaturesSection from './FeaturesSection';
import NewsAndUpdatesSection from './NewsAndUpdatesSection';
import PromotionsAndOffersSection from './PromotionsAndOffersSection';
import DarkModeToggle from './DarkModeToggle';
import heroImage from '../assets/hero-image.jpg';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginBottom: theme.spacing(4),
    height: '95px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
    color: '#ff4081',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    '& .MuiLink-root': {
      textDecoration: 'none',
      color: 'inherit'
    },
    '&:hover': {
      color: '#ff4081'
    }
  },
  container: {
    marginTop: theme.spacing(3)
  },
  headerSection: {
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '72vh',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  },
  section: {
    padding: theme.spacing(3)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2),
    width: 'auto'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[800]
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.disabled
    },
    '&::selection': {
      backgroundColor: theme.palette.primary.main
    },
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.disabled
    },
    '&::-moz-placeholder': {
      color: theme.palette.text.disabled
    },
    '&:-ms-input-placeholder': {
      color: theme.palette.text.disabled
    },
    '&:-moz-placeholder': {
      color: theme.palette.text.disabled
    },
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch'
      }
    }
  },
  authButtonsContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  notificationButton: {
    color: theme.palette.secondary.main
  },
  badge: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white
  },
  darkModeToggleContainer: {
    marginLeft: 'auto'
  },
  heroSection: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  },
  highlightedText: {
    backgroundColor: '#1976D2',
    color: 'white',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1)
  },
  ctaButton: {
    marginTop: theme.spacing(3),
    backgroundColor: '#1976D2',
    color: 'white',
    fontSize: '1.2em',
    padding: theme.spacing(2, 4),
    '&:hover': {
      backgroundColor: 'darkblue'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}));

function HomePage () {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
              FinTrust
            </Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <IconButton className={classes.notificationButton}>
            <Badge badgeContent={4} classes={{ badge: classes.badge }}>
              <NotificationsIcon fontSize='large' />
            </Badge>
          </IconButton>
          <Box className={classes.darkModeToggleContainer}>
            <DarkModeToggle />
          </Box>
          <Box ml={4} className={classes.authButtonsContainer}>
            <AuthButtonsContainer />
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        className={classes.heroSection}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <Container maxWidth='lg'>
          <Box className={classes.headerSection}>
            <Box style={{ maxWidth: '600px' }}>
              <Typography variant='h2' component='h1' gutterBottom>
                Your Trusted Financial Partner
              </Typography>
              <Typography variant='h6' color='textSecondary' paragraph>
                <span className={classes.highlightedText}>
                  Manage your finances with ease and confidence.
                </span>
              </Typography>
              <Typography variant='h6' color='textSecondary' paragraph>
                <span className={classes.highlightedText}>
                  Join FinTrust today and experience the difference.
                </span>
              </Typography>
              <Button
                variant='contained'
                color='primary' size='large'
                className={classes.ctaButton}
                component={Link}
                to='/registration'
              >
                Get Started
              </Button>
            </Box>
            {!isMobile && <HomeIcon style={{ fontSize: '10rem' }} />}
          </Box>
        </Container>
      </Box>
      <Container className={classes.container} maxWidth='lg'>
        <FeaturesSection />
        <NewsAndUpdatesSection />
        <PromotionsAndOffersSection />
      </Container>
      <Footer />
    </div>
  );
}

export default HomePage;
