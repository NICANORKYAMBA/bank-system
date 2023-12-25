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
  ListItem
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

function NewsAndUpdatesSection () {
  // Sample news and updates data
  const newsUpdates = [
    {
      title: 'FinTrust Bank Announces New Mobile App Features',
      date: 'December 15, 2022',
      content: 'Explore the latest features and enhancements in our mobile banking app. Stay connected with your finances on the go!'
    },
    {
      title: 'Financial Tips for a Successful Investment Journey',
      date: 'November 28, 2022',
      content: 'Learn valuable insights and tips for making successful investments. Our experts share their advice for financial growth.'
    }
  ];

  return (
    <Grid item xs={12}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          News and Updates
        </Typography>

        {/* News Feed */}
        <List>
          {newsUpdates.map((update, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      {update.title}
                    </Typography>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {update.date}
                    </Typography>
                    <Typography variant='body1' paragraph>
                      {update.content}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Container>
    </Grid>
  );
}

function PromotionsAndOffersSection () {
  // Sample promotions and offers data
  const promotions = [
    {
      title: 'New Customer Welcome Bonus',
      description: 'Open an account and get a $50 welcome bonus! Limited time offer for new customers.',
      buttonText: 'Learn More',
      buttonLink: '/welcome-bonus'
    },
    {
      title: 'Holiday Savings Special',
      description: 'Save big this holiday season with our special savings account. Earn higher interest rates for a limited time.',
      buttonText: 'Explore Savings',
      buttonLink: '/holiday-savings'
    }
  ];

  return (
    <Grid item xs={12}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          Promotions and Offers
        </Typography>

        {promotions.map((promotion, index) => (
          <Card key={index} variant='outlined' style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant='h6' component='div' gutterBottom>
                {promotion.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {promotion.description}
              </Typography>
              <Button variant='contained' href={promotion.buttonLink} target='_blank'>
                {promotion.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Grid>
  );
}

function WelcomeMessage () {
  return (
    <Grid item xs={12} sm={8} md={9} lg={10} style={{ textAlign: 'center' }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Welcome to FinTrust Bank
      </Typography>
      <Typography variant='body1' paragraph>
        Your trusted partner for secure and efficient banking services.
        We prioritize your financial well-being and offer a range of solutions to meet your needs.
      </Typography>
    </Grid>
  );
}

function HomeIcon () {
  return (
    <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
      <Tooltip title='FinTrust Bank'>
        <AccountBalanceIcon fontSize='inherit' style={{ fontSize: '5em' }} />
      </Tooltip>
    </Grid>
  );
}

function LoginButton ({ onClick }) {
  return (
    <Button
      variant='contained'
      size='large'
      startIcon={<AccountBalanceIcon />}
      onClick={onClick}
      aria-label='Login'
      style={{ margin: '10px', fontSize: '1.2em' }}
    >
      Login
    </Button>
  );
}

function RegisterButton ({ onClick }) {
  return (
    <Button
      variant='outlined'
      size='large'
      startIcon={<DescriptionIcon />}
      onClick={onClick}
      aria-label='Register'
      style={{ margin: '10px', fontSize: '1.2em' }}
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

function FeaturesSection ({ features }) {
  return (
    <Grid item xs={12}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={3} alignItems='stretch' justifyContent='center'>
          {features.map((feature, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
              <Tooltip title={feature.title}>{feature.icon}</Tooltip>
              <Typography variant='h6' gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant='body2'>{feature.description}</Typography>
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

function Home () {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const showLogin = useSelector((state) => state.showLogin);
  const showRegister = useSelector((state) => state.showRegister);

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
    <Box className={`${isDarkMode ? 'darkMode' : ''}`}>
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
