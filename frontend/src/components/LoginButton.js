import {
  Button,
  makeStyles
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles((theme) => ({
  loginButton: {
    backgroundColor: '#1976D2',
    color: theme.palette.common.white,
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontSize: '1.2em',
    marginTop: theme.spacing(6),
    marginRight: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // add a subtle shadow
    transition: '0.3s', // add a transition for hover effect
    '&:hover': {
      backgroundColor: '#135895',
      transform: 'scale(1.1)' // scale the button on hover
    }
  }
}));

function LoginButton ({ onClick, className }) {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      size='large'
      startIcon={<AccountBalanceIcon />}
      onClick={onClick}
      aria-label='Login'
      className={`${classes.loginButton} ${className}`}
    >
      Login
    </Button>
  );
}

export default LoginButton;
