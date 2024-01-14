import React from 'react';
import { Container, Typography, makeStyles, Link, Box } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Logo from '../assets/logo.png';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(6),
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(8),
    borderTop: `1px solid ${theme.palette.divider}`
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  link: {
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0
    }
  },
  logo: {
    width: '100px',
    height: 'auto',
    marginRight: theme.spacing(2)
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    '& svg': {
      fontSize: '2rem',
      color: theme.palette.text.primary
    }
  }
}));

function Footer () {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth='lg'>
        <div className={classes.footerContent}>
          <img src={Logo} alt='Logo' className={classes.logo} />
          <Typography variant='body1'>&copy; {new Date().getFullYear()} FinTrust Bank</Typography>
          <div>
            <Link href='#' className={classes.link}>
              Privacy Policy
            </Link>
            <Link href='#' className={classes.link}>
              Terms of Use
            </Link>
            <Link href='#' className={classes.link}>
              Contact Us
            </Link>
            <Link href='#' className={classes.link}>
              FAQ
            </Link>
            <Link href='#' className={classes.link}>
              About Us
            </Link>
          </div>
          <Box className={classes.socialIcons}>
            <FacebookIcon />
            <TwitterIcon />
            <InstagramIcon />
            <LinkedInIcon />
          </Box>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
