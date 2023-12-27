import {
  Button,
  makeStyles
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  registerButton: {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontSize: '1.2em',
    marginTop: theme.spacing(6),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // add a subtle shadow
    transition: '0.3s', // add a transition for hover effect
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      transform: 'scale(1.1)' // scale the button on hover
    }
  }
}));

function RegisterButton ({ onClick, className }) {
  const classes = useStyles();

  return (
    <Button
      variant='outlined'
      size='large'
      startIcon={<DescriptionIcon />}
      onClick={onClick}
      aria-label='Register'
      className={`${classes.registerButton} ${className}`}
    >
      Register
    </Button>
  );
}

export default RegisterButton;
