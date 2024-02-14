import React from 'react';
import {
  Typography,
  Grid,
  Container,
  Paper,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { 
FaRegMoneyBillAlt, 
FaLock, 
FaInfoCircle, 
FaMobileAlt, 
FaHeadset, 
FaChartLine 
} from 'react-icons/fa';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(6),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    marginTop: theme.spacing(14),
    marginBottom: theme.spacing(3)
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
      transform: 'scale(1.1)'
    }
  },
  featureIcon: {
    fontSize: '4em',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: theme.palette.secondary.main
    }
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  featureDescription: {
    color: theme.palette.text.secondary
  }
}));

function FeaturesSection () {
  const classes = useStyles();

  const features = [
    {
      title: 'Personalized Banking',
      icon: <FaRegMoneyBillAlt />,
      description: 'Tailored financial solutions to meet your unique needs.'
    },
    {
      title: 'Secure Transactions',
      icon: <FaLock />,
      description: 'Enjoy safe and secure online transactions.'
    },
    {
      title: 'Transparent Services',
      icon: <FaInfoCircle />,
      description: 'Clear and transparent communication about our services.'
    },
    {
      title: 'Mobile Banking',
      icon: <FaMobileAlt />,
      description: 'Access your accounts and manage transactions on the go.'
    },
    {
      title: '24/7 Customer Support',
      icon: <FaHeadset />,
      description: 'Dedicated support available 24/7 to assist you.'
    },
    {
      title: 'Investment Opportunities',
      icon: <FaChartLine />,
      description: 'Explore a variety of investment options for your financial growth.'
    }
  ];

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

export default FeaturesSection;
