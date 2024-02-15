import React from 'react';
import {
  Container,
  Typography,
  makeStyles,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { 
  FaGift, 
  FaQuestionCircle, 
  FaUserCheck 
} from 'react-icons/fa';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  icon: {
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2)
  },
  iconSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  sectionIcon: {
    marginRight: theme.spacing(1),
    fontSize: '2rem'
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.text.primary
  },
  description: {
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    },
    padding: theme.spacing(1.5, 5),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none'
  },
  faqSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  testimonialSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  faqTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  },
  testimonialTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  },
  faqItem: {
    marginBottom: theme.spacing(2)
  },
  testimonialItem: {
    marginBottom: theme.spacing(2)
  }
}));

function WelcomeBonusPage () {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <FaGift className={classes.icon} />
      <Typography variant='h3' className={classes.title}>
        New Customer Welcome Bonus
      </Typography>
      <Typography variant='body1' className={classes.description}>
        We're excited to have you join our community of satisfied customers. As a token of our appreciation, we're offering a special welcome bonus to all new customers.
      </Typography>
      <Typography variant='body1' className={classes.description}>
        When you open an account with us, you'll receive a $50 bonus to get you started on your financial journey. This offer is available for a limited time, so don't miss out on this exclusive opportunity.
      </Typography>
      <Button variant='contained' className={classes.button}>
        Open an Account
      </Button>
      <Card className={classes.faqSection}>
        <CardContent>
          <FaQuestionCircle className={classes.sectionIcon} />
          <Typography variant='h4' className={classes.faqTitle}>
            Frequently Asked Questions
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
              primary='What is the welcome bonus?' />
            </ListItem>
            <ListItem>
              <ListItemText 
              primary='How do I claim my welcome bonus?' />
            </ListItem>
            <ListItem>
              <ListItemText 
              primary='Is there a limit to the number of times I can claim the welcome bonus?' />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card className={classes.testimonialSection}>
        <CardContent>
          <FaUserCheck className={classes.sectionIcon} />
          <Typography variant='h4' className={classes.testimonialTitle}>
            Testimonials
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
              primary='I received my welcome bonus and it helped me start my financial journey!' 
              secondary='- Happy Customer' />
            </ListItem>
            <ListItem>
              <ListItemText 
              primary='This was a great way to kick off my banking experience with FinTrust!' 
              secondary='- Satisfied Customer' />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default WelcomeBonusPage;
