import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Tooltip,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Paper,
  makeStyles,
} from '@material-ui/core';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DescriptionIcon from '@material-ui/icons/Description';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import {
  toggleDarkMode,
  showLogin,
  hideLogin,
  showRegister,
  hideRegister
} from '../redux/actions/actions';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(3),
  },
  card: {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(3),
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  cardDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  cardDate: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  cardContentText: {
    color: theme.palette.text.primary,
  },
  welcomeContainer: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[3],
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: theme.palette.secondary.main,
    textShadow: `1px 1px 2px ${theme.palette.primary.dark}`,
  },
  welcomeText: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.common.white,
    lineHeight: 1.6,
  },
  iconContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(0),
  },
  icon: {
    fontSize: '7em',
    color: theme.palette.primary.main,
    borderRadius: '50%',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
  },
  tooltip: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#1976D2',
    color: theme.palette.common.white,
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontSize: '1.2em',
    marginTop: theme.spacing(6),
    marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#135895',
    },
  },
  registerButton: {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontSize: '1.2em',
    marginTop: theme.spacing(6),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
  section: {
    padding: theme.spacing(6),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(14),
    marginBottom: theme.spacing(3),
  },
  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
    minHeight: '250px',
    height: '50%',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  featureIcon: {
    fontSize: '4em',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  featureDescription: {
    color: theme.palette.text.secondary,
  },
  darkMode: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

function NewsAndUpdatesSection() {
  const classes = useStyles();

  const newsUpdates = [
    {
      title: 'FinTrust Bank Announces New Mobile App Features',
      date: 'December 15, 2022',
      content:
        'Explore the latest features and enhancements in our mobile banking app. Stay connected with your finances on the go!',
    },
    {
      title: 'Financial Tips for a Successful Investment Journey',
      date: 'November 28, 2022',
      content:
        'Learn valuable insights and tips for making successful investments. Our experts share their advice for financial growth.',
    },
  ];

  return (
    <Grid item xs={12} className={classes.sectionContainer}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          News and Updates
        </Typography>

        <List>
          {newsUpdates.map((update, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography variant='h6' className={classes.cardTitle}>
                      {update.title}
                    </Typography>
                    <Typography variant='subtitle2' className={classes.cardDate}>
                      {update.date}
                    </Typography>
                    <Typography variant='body1' className={classes.cardContentText}>
                      {update.content}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
              {index !== newsUpdates.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Container>
    </Grid>
  );
}

function PromotionsAndOffersSection() {
  const classes = useStyles();

  const promotions = [
    {
      title: 'New Customer Welcome Bonus',
      description:
        'Open an account and get a $50 welcome bonus! Limited time offer for new customers.',
      buttonText: 'Learn More',
      buttonLink: '/welcome-bonus',
    },
    {
      title: 'Holiday Savings Special',
      description:
        'Save big this holiday season with our special savings account. Earn higher interest rates for a limited time.',
      buttonText: 'Explore Savings',
      buttonLink: '/holiday-savings',
    },
  ];

  return (
    <Grid item xs={12} className={classes.sectionContainer}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          Promotions and Offers
        </Typography>

        {promotions.map((promotion, index) => (
          <Card key={index} className={classes.card} variant='outlined'>
            <CardContent className={classes.cardContent}>
              <Typography variant='h6' className={classes.cardTitle}>
                {promotion.title}
              </Typography>
              <Typography variant='body2' className={classes.cardDescription}>
                {promotion.description}
              </Typography>
              <Button
                variant='contained'
                href={promotion.buttonLink}
                target='_blank'
                className={classes.button}
              >
                {promotion.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Grid>
  );
}

function WelcomeMessage() {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={8} md={9} lg={10} className={classes.welcomeContainer}>
      <Container>
        <Typography variant='h4' component='h1' className={classes.welcomeTitle} gutterBottom>
          Welcome to FinTrust Bank
        </Typography>
        <Typography variant='body1' className={classes.welcomeText} paragraph>
          Your trusted partner for secure and efficient banking services.
          We prioritize your financial well-being and offer a range of solutions to meet your needs.
        </Typography>
      </Container>
    </Grid>
  );
}

function HomeIcon() {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.iconContainer}>
      <Tooltip title='FinTrust Bank' classes={{ tooltip: classes.tooltip }}>
        <Box className={classes.icon}>
          <AccountBalanceIcon fontSize='inherit' />
        </Box>
      </Tooltip>
    </Grid>
  );
}

function LoginButton({ onClick }) {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      size='large'
      startIcon={<AccountBalanceIcon />}
      onClick={onClick}
      aria-label='Login'
      className={classes.loginButton}
    >
      Login
    </Button>
  );
}

function RegisterButton({ onClick }) {
  const classes = useStyles();

  return (
    <Button
      variant='outlined'
      size='large'
      startIcon={<DescriptionIcon />}
      onClick={onClick}
      aria-label='Register'
      className={classes.registerButton}
    >
      Register
    </Button>
  );
}

function AuthButtonsContainer ({ children }) {
  return (
    <div style={{ textAlign: 'center' }}>
      {children}
    </div>
  );
}

function FeaturesSection({ features }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.section}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={3} alignItems='stretch' justifyContent='center'>
          {features.map((feature, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
              <Paper elevation={3} className={classes.featureItem}>
                <Tooltip title={feature.title}>
                  <span className={classes.featureIcon}>{feature.icon}</span>
                </Tooltip>
                <Typography variant='h6' className={classes.featureTitle} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant='body2' className={classes.featureDescription}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Grid>
  );
}

function Header ({
  isDarkMode,
  toggleDarkMode,
  handleLoginClick,
  handleRegisterClick
}) {
  const features = [
    {
      title: 'Personalized Banking',
      icon: <MonetizationOnIcon />,
      description: 'Tailored financial solutions to meet your unique needs.'
    },
    {
      title: 'Secure Transactions',
      icon: <CreditCardIcon />,
      description: 'Enjoy safe and secure online transactions.'
    },
    {
      title: 'Transparent Services',
      icon: <DescriptionIcon />,
      description: 'Clear and transparent communication about our services.'
    },
    {
      title: 'Mobile Banking',
      icon: <PhoneAndroidIcon />,
      description: 'Access your accounts and manage transactions on the go.'
    },
    {
      title: '24/7 Customer Support',
      icon: <HeadsetMicIcon />,
      description: 'Dedicated support available 24/7 to assist you.'
    },
    {
      title: 'Investment Opportunities',
      icon: <TrendingUpIcon />,
      description: 'Explore a variety of investment options for your financial growth.'
    }
  ];

  return (
    <Grid container spacing={3} alignItems='center' justifyContent='center'>
      <HomeIcon />
      <WelcomeMessage />

      {/* Buttons */}
      <Grid item xs={12}>
        <AuthButtonsContainer>
          <LoginButton onClick={handleLoginClick} />
          <RegisterButton onClick={handleRegisterClick} />
        </AuthButtonsContainer>
      </Grid>

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Add new sections */}
      <NewsAndUpdatesSection />
      <PromotionsAndOffersSection />
    </Grid>
  );
}

function DarkModeToggle ({ toggleDarkMode }) {
  return (
    <IconButton
      onClick={toggleDarkMode}
      aria-label='Toggle Dark Mode'
    >
      <Brightness4Icon />
    </IconButton>
  );
}

function Dialogs ({ showLogin, showRegister, handleClose }) {
  return (
    <>
      <Dialog open={showLogin} onClose={handleClose}>
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
      <Dialog open={showRegister} onClose={handleClose}>
        <DialogContent>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Home() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const showLogin = useSelector((state) => state.showLogin);
  const showRegister = useSelector((state) => state.showRegister);

  const classes = useStyles();

  const handleLoginClick = () => {
    dispatch(showLogin());
  };

  const handleRegisterClick = () => {
    dispatch(showRegister());
  };

  const handleClose = () => {
    dispatch(hideLogin());
    dispatch(hideRegister());
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Box className = {`${isDarkMode ? classes.darkMode : ''}`}>
      <DarkModeToggle toggleDarkMode={handleToggleDarkMode} />
      <Container>
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={handleToggleDarkMode}
          handleLoginClick={handleLoginClick}
          handleRegisterClick={handleRegisterClick}
        />
      </Container>
      <Dialogs
        showLogin={showLogin}
        showRegister={showRegister}
        handleClose={handleClose}
      />
    </Box>
  );
}

export default Home;
