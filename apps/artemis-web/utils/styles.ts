import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core';
import {
  deepOrange,
  deepPurple,
  lightBlue,
  orange,
  blue,
} from '@material-ui/core/colors';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';

import { purple } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

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
