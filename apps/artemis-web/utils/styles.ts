import { createMuiTheme, makeStyles } from '@material-ui/core';
import {
  deepOrange,
  deepPurple,
  lightBlue,
  orange,
} from '@material-ui/core/colors';

const palletType = 'dark';
const darkState = false;
const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

export const useStyles = makeStyles((_theme) => ({
  paper: {
    // marginTop: _theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '2.5rem',
    paddingTop: '8px',
  },
  avatar: {
    margin: _theme.spacing(1),
    backgroundColor: _theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: _theme.spacing(3),
  },
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: '#ffff',
  },
}));

export const theme = createMuiTheme({
  palette: {
    type: palletType,
    primary: {
      main: mainPrimaryColor,
    },
    secondary: {
      main: mainSecondaryColor,
    },
  },
});

export const useFooterStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    left: '0px;',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    position: 'absolute',
    height: '4.5rem',
    bottom: '0px',
    width: '100%',
    backgroundColor: theme.palette.grey[800],
  },
  link: {
    color: '#ffff',
    textAlign: 'left',
    left: '-10%',
  },
}));
