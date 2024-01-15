import React from 'react';
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Divider,
  makeStyles
} from '@material-ui/core';
import { FaNewspaper } from 'react-icons/fa';

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(3)
  },
  card: {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(3),
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  cardDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2)
  },
  cardDate: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2)
  },
  icon: {
    fontSize: '2em',
    marginRight: theme.spacing(1)
  }
}));

function NewsAndUpdatesSection () {
  const classes = useStyles();

  const newsUpdates = [
    {
      title: 'FinTrust Bank Announces New Mobile App Features',
      date: 'December 15, 2022',
      content:
       'Explore the latest features and enhancements in our mobile banking app. Stay connected with your finances on the go!'
    },
    {
      title: 'Financial Tips for a Successful Investment Journey',
      date: 'November 28, 2022',
      content:
       'Learn valuable insights and tips for making successful investments. Our experts share their advice for financial growth.'
    }
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
                    <FaNewspaper className={classes.icon} />
                    <Typography variant='h6' className={classes.cardTitle}>
                      {update.title}
                    </Typography>
                    <Typography variant='subtitle2' className={classes.cardDate}>
                      {update.date}
                    </Typography>
                    <Typography variant='body1' className={classes.cardDescription}>
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

export default NewsAndUpdatesSection;
