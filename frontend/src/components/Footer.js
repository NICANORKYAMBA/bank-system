import React from 'react';
import { Container, Typography, Grid, Link } from '@material-ui/core';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth={false}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="h6" gutterBottom className={styles.footerTitle}>
              FinTrust Bank
            </Typography>
            <Typography variant="body2" color="textSecondary" className={styles.footerDescription}>
              Your trusted partner for secure and efficient banking services.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="h6" gutterBottom className={styles.footerTitle}>
              Quick Links
            </Typography>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/about" color="inherit" className={styles.footerLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" color="inherit" className={styles.footerLink}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" color="inherit" className={styles.footerLink}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="h6" gutterBottom className={styles.footerTitle}>
              Contact Information
            </Typography>
            <Typography variant="body2" color="textSecondary" className={styles.footerInfo}>
              Address: 123 Main St, Cityville
            </Typography>
            <Typography variant="body2" color="textSecondary" className={styles.footerInfo}>
              Email: info@fintrustbank.com
            </Typography>
            <Typography variant="body2" color="textSecondary" className={styles.footerInfo}>
              Phone: +123 456 7890
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}

export default Footer;