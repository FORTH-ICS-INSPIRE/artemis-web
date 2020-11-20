import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
  deepOrange,
  deepPurple,
  lightBlue,
  orange,
} from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

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
  const router = useRouter();

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
      // withCredentials: true,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      const token = await res.json();
      if (token.user.role === 'pending') {
        router.push('/pending');
      } else {
        router.push('/dashboard');
      }
      window.location.reload();
    } else {
      setErrorMsg('Incorrect username or password. Try again!');
    }
  }

  async function onLDAP(e) {
    e.preventDefault();

    const body = {
      username: 'admin',
      password: 'GoodNewsEveryone',
    };

    const res = await fetch('/api/ldap', {
      method: 'POST',
      // withCredentials: true,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
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
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={props.classes.submit}
              onClick={onLDAP}
            >
              LDAP
            </Button>
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
