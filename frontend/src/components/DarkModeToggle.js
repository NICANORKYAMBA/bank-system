import Brightness4Icon from '@material-ui/icons/Brightness4';
import { IconButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  darkModeButton: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '50%',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    },
    '& svg': {
      fontSize: '1.5rem'
    },
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    fontSize: '2rem'
  }
}));

function DarkModeToggle ({ toggleDarkMode }) {
  const classes = useStyles();

  return (
    <IconButton
      onClick={toggleDarkMode}
      aria-label='Toggle Dark Mode'
      className={classes.darkModeButton}
    >
      <Brightness4Icon />
    </IconButton>
  );
}

export default DarkModeToggle;
