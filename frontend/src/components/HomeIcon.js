import {
  Grid,
  Tooltip,
  Box,
  makeStyles
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(0),
    backgroundColor: '#093A3E'
  },
  icon: {
    fontSize: '5em',
    color: '#040303', // set the color to #040303
    padding: theme.spacing(3),
    // backgroundColor: theme.palette.common.white,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
  },
  tooltip: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 'bold'
  }
}));

function HomeIcon () {
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

export default HomeIcon;
