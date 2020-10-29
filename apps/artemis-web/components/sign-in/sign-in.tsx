import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
  orange,
  lightBlue,
  deepOrange,
  deepPurple,
} from '@material-ui/core/colors';
import Router from 'next/router';

import { useState } from 'react';

const palletType = 'dark';
const darkState = false;
const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

const theme = createMuiTheme({
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

const useStyles = makeStyles((_theme) => ({
  paper: {
    marginTop: _theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: _theme.spacing(1),
    backgroundColor: _theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: _theme.spacing(1),
  },
  main: {},
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: '#ffff',
  },
}));

const SignIn = (props) => {
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault();

    const rememberMe = e.currentTarget.remember.checked;

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      rememberMe: rememberMe,
    };

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      const userObj = await res.json();
      if (userObj) Router.push('/overview');
    } else {
      setErrorMsg('Incorrect username or password. Try again!');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={props.classes.paper}>
          <img
            width="150"
            src="./login.png"
            alt="avatar"
            className="img-responsive"
          />
          <Typography
            className={props.classes.input}
            component="h1"
            variant="h5"
          >
            Sign in
          </Typography>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <form method="post" onSubmit={onSubmit}>
            <input name="stype" type="hidden" defaultValue="signin" />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              color="primary"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              className={props.classes.input}
              control={
                <Checkbox value="remember" name="remember" color="primary" />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={props.classes.submit}
            >
              Sign In
            </Button>
            {/* <Button
              fullWidth
              variant="contained"
              color="primary"
              className={props.classes.submit}
            >
              Sign In with GitHub
            </Button> */}
            <Grid container>
              <Grid style={{ textAlign: 'left' }} item xs></Grid>
              <Grid item>
                <Link color="primary" href="/signup" variant="body2">
                  Dont have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

const SignInComponent = (props) => {
  const classes = useStyles();
  return <SignIn {...props} classes={classes} />;
};
export default SignInComponent;
