import {
  Grid,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  welcomeContainer: {
    backgroundColor: '#040303',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    color: '#ffffff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
  },
  welcomeTitle: {
    fontWeight: 600,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
    color: '#4E937A',
    textShadow: `1px 1px 2px ${theme.palette.primary.dark}`,
    textAlign: 'center',
    fontFamily: 'Roboto, sans-serif'
  },
  welcomeText: {
    fontSize: '1.0rem',
    color: '#ffffff',
    lineHeight: 1.8,
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontFamily: 'Roboto, sans-serif'
  }
}));

function WelcomeMessage () {
  const classes = useStyles();

  return (
    <Grid container justify='center'>
      <Grid item xs={12} sm={8} md={9} lg={10} className={classes.welcomeContainer}>
        <Container>
          <Typography variant='h4' component='h1' className={classes.welcomeTitle} gutterBottom>
            Welcome to FinTrust Bank
          </Typography>
          <Typography variant='body1' className={classes.welcomeText} paragraph>
            At FinTrust Bank, we believe in the power of financial freedom. We are committed to providing secure, efficient, and personalized banking services that put you first. Our team of dedicated professionals is always ready to assist you, ensuring that your financial well-being is our top priority.
            <br /><br />
            We offer a wide range of solutions tailored to meet your unique needs. Whether you're looking to open a savings account, invest in the future, or simply manage your daily transactions, we've got you covered.
            <br /><br />
            Join us today and experience banking like never before. Welcome to a world of endless possibilities. Welcome to FinTrust Bank.
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
}

export default WelcomeMessage;
