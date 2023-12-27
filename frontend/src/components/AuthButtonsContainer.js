import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '10vh',
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

function AuthButtonsContainer () {
  const classes = useStyles();

  return (
    <Box className={classes.buttonContainer}>
      <LoginButton />
      <RegisterButton />
    </Box>
  );
}

export default AuthButtonsContainer;
