import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  createTheme,
} from '@material-ui/core';

import {
  deepOrange,
  deepPurple,
  lightBlue,
  orange,
} from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';

const palletType = 'light';
const darkState = false;
const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

export const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 64,
      height: 38,
      padding: 2,
      paddingRight: 6,
      margin: theme.spacing(1),
    },
    switchBase: {
      paddingTop: 6,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#2196F3',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 26,
      height: 26,
    },
    track: {
      borderRadius: 40 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: '#ccc',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  })
)(Switch);

export const styles = (_theme) => ({
  avatar: {
    margin: _theme.spacing(1),
    backgroundColor: _theme.palette.secondary.main,
  },
  activeButton: {
    color: 'white',
    backgroundColor: '#28a745',
    '&:hover, &:focus': {
      backgroundColor: '#28a745',
    },
  },
  inactiveButton: {
    color: 'white',
    backgroundColor: '#DC3545',
    '&:hover, &:focus': {
      backgroundColor: '#DC3545',
    },
  },
  filterButton: {
    color: 'black',
    backgroundColor: '#FFC107',
    '&:hover, &:focus': {
      backgroundColor: '#FFC107',
    },
  },
  cancelButton: {
    color: 'black',
    backgroundColor: '#FFC107',
    '&:hover, &:focus': {
      backgroundColor: '#FFC107',
    },
  },
  button: {
    color: 'white',
    backgroundColor: '#007bff',
    '&:hover, &:focus': {
      backgroundColor: '#007bff',
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: _theme.spacing(3),
  },
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: 'black',
    marginTop: '15px',
    marginBottom: '15px',
    fontSize: '1.75rem',
  },
});

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
  activeButton: {
    color: 'white !important',
    backgroundColor: '#28a745 !important',
    '&:hover, &:focus': {
      backgroundColor: '#28a745 !important',
    },
  },
  inactiveButton: {
    color: 'white !important',
    backgroundColor: '#DC3545 !important',
    '&:hover, &:focus': {
      backgroundColor: '#DC3545 !important',
    },
  },
  filterButton: {
    color: 'black',
    backgroundColor: '#FFC107',
    '&:hover, &:focus': {
      backgroundColor: '#FFC107',
    },
  },
  cancelButton: {
    color: 'black !important',
    backgroundColor: '#FFC107 !important',
    '&:hover, &:focus': {
      backgroundColor: '#FFC107 !important',
    },
  },
  button: {
    color: 'white !important',
    backgroundColor: '#007bff !important',
    '&:hover, &:focus': {
      backgroundColor: '#007bff !important',
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: _theme.spacing(3),
  },
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: 'black',
    marginTop: '15px',
    marginBottom: '15px',
    fontSize: '1.75rem',
  },
}));

export const theme = createTheme({
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
    backgroundColor: '#f2f2f2',
    borderTop: '1px solid #e4e4e4',
    color: 'black',
  },
  link: {
    color: '#ffff',
    textAlign: 'left',
    left: '-10%',
  },
}));
