import {
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  makeStyles,
  CardMedia,
  Icon
} from '@material-ui/core';
import {
  FaGift,
  FaStar,
  FaTree
} from 'react-icons/fa';

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
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main
  },
  cardDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2)
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
}));

function PromotionsAndOffersSection () {
  const classes = useStyles();

  const promotions = [
    {
      title: 'New Customer Welcome Bonus',
      description:
       'Open an account and get a $50 welcome bonus! Limited time offer for new customers.',
      buttonText: 'Learn More',
      buttonLink: '/welcome-bonus',
      icon: <FaGift size={48} />
    },
    {
      title: 'Holiday Savings Special',
      description:
       'Save big this holiday season with our special savings account. Earn higher interest rates for a limited time.',
      buttonText: 'Explore Savings',
      buttonLink: '/holiday-savings',
      icon: <FaTree size={48} />
    }
  ];

  return (
    <Grid item xs={12} className={classes.sectionContainer}>
      <Container maxWidth='md'>
        <Typography variant='h4' component='h2' gutterBottom>
          Promotions and Offers
        </Typography>

        {promotions.map((promotion, index) => (
          <Card key={index} className={classes.card} variant='outlined'>
            {promotion.image && (
              <CardMedia
                className={classes.cardImage}
                image={promotion.image}
                title={promotion.title}
              />
            )}
            <CardContent className={classes.cardContent}>
              <Icon>{index === 0 ? <FaGift /> : <FaStar />}</Icon>
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

export default PromotionsAndOffersSection;
