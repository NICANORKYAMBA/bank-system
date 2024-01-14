import React from 'react';
import {
  Container,
  Typography,
  makeStyles,
  Box
} from '@material-ui/core';
import { FaQuestionCircle, FaUserCheck, FaTree } from 'react-icons/fa';
import backgroundImage from '../assets/background.jpg';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    color: '#fff',
    transition: 'all 0.5s ease'
  },
  icon: {
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    animation: '$fadeIn 2s ease-in-out'
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.text.primary,
    animation: '$fadeIn 2s ease-in-out'
  },
  description: {
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
    animation: '$fadeIn 2s ease-in-out'
  },
  faqSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    animation: '$fadeIn 2s ease-in-out'
  },
  testimonialSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    animation: '$fadeIn 2s ease-in-out'
  },
  detailsSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    animation: '$fadeIn 2s ease-in-out'
  },
  detailsTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    animation: '$fadeIn 2s ease-in-out'
  },
  detailsItem: {
    marginBottom: theme.spacing(2),
    animation: '$fadeIn 2s ease-in-out'
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  }
}));

function HolidaySavingsSpecialPage () {
  const classes = useStyles();

  return (
    <Container
      className={classes.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <FaTree className={classes.icon} />
      <Typography variant='h3' className={classes.title}>
        Holiday Savings Special
      </Typography>
      <Typography variant='body1' className={classes.description}>
        Save big this holiday season with our special savings account. Earn higher interest rates for a limited time. With our Holiday Savings Special, you can enjoy a 5% APR interest rate for a period of 6 months. To qualify, you need to make a minimum deposit of $100. This offer is available for a limited time, so don't miss out on this exclusive opportunity.
      </Typography>
      <Box className={classes.faqSection}>
        <Box className={classes.iconSection}>
          <FaQuestionCircle className={classes.sectionIcon} />
          <Typography variant='h4' className={classes.faqTitle}>
            Frequently Asked Questions
          </Typography>
        </Box>
        <Typography variant='body1' className={classes.faqItem}>
          What does the Holiday Savings Special entail?
        </Typography>
        <Typography variant='body1' className={classes.faqItem}>
          How do I participate in the Holiday Savings Special?
        </Typography>
        <Typography variant='body1' className={classes.faqItem}>
          Is there a limit to the amount I can save during the Holiday Savings Special?
        </Typography>
      </Box>
      <Box className={classes.testimonialSection}>
        <Box className={classes.iconSection}>
          <FaUserCheck className={classes.sectionIcon} />
          <Typography variant='h4' className={classes.testimonialTitle}>
            Testimonials
          </Typography>
        </Box>
        <Typography variant='body1' className={classes.testimonialItem}>
          "I saved a significant amount during the Holiday Savings Special!" - Happy Saver
        </Typography>
        <Typography variant='body1' className={classes.testimonialItem}>
          "This was a great way to boost my savings during the holiday season!" - Thrifty Customer
        </Typography>
      </Box>
      <Box className={classes.detailsSection}>
        <Typography variant='h4' className={classes.detailsTitle}>
          Details
        </Typography>
        <Typography variant='body1' className={classes.detailsItem}>
          Interest Rate: 5% APR
        </Typography>
        <Typography variant='body1' className={classes.detailsItem}>
          Duration: 6 months
        </Typography>
        <Typography variant='body1' className={classes.detailsItem}>
          Minimum Deposit: $100
        </Typography>
        <Typography variant='body1' className={classes.detailsItem}>
          Early Withdrawal Penalty: None
        </Typography>
        <Typography variant='body1' className={classes.detailsItem}>
          Tax Implications: No tax implications for interest earned
        </Typography>
      </Box>
    </Container>
  );
}

export default HolidaySavingsSpecialPage;
