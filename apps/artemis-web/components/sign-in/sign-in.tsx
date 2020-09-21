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
import cookie from 'js-cookie';
import Router from 'next/router';

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
  main: {
    // marginTop: "80px"
  },
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: '#ffff',
  },
}));

type MyProps = {
  classes: {
    paper: string;
    avatar: string;
    form: string;
    submit: string;
    input: string;
    main: string;
  };
};

type MyState = {
  email: string;
  password: string;
  loginError: string;
};

class SignIn extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
      loginError: '',
    };
  }

  public handleSubmit = (e: any): void => {
    e.preventDefault();

    const { email } = this.state;
    const { password } = this.state;
    this.setState = this.setState.bind(this);

    ((statef) => {
      // call api
      fetch('/api/_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((r) => {
          return r.json();
        })
        .then((data) => {
          if (data && data.error) {
            statef({ loginError: data.message });
          }
          if (data && data.token) {
            // set cookie
            cookie.set('token', data.token, { expires: 2 });
            Router.push('/');
          }
        });
    })(this.setState);
  };

  validateForm() {
    const { email, password } = this.state;
    const isValid = email.length > 0 && password.length > 0;
    return isValid;
  }

  render() {
    const { classes } = this.props;
    const { loginError } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <img
              width="150"
              src="./login.png"
              alt="avatar"
              className="img-responsive"
            />
            <Typography className={classes.input} component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
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
                onChange={(e) => this.setState({ email: e.target.value })}
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
                onChange={(e) => this.setState({ password: e.target.value })}
                autoComplete="current-password"
              />
              <FormControlLabel
                className={classes.input}
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!this.validateForm}
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid style={{ textAlign: 'left' }} item xs>
                  {/* <Link href="/" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
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
  }
}

const SignIn2 = () => {
  const classes = useStyles();
  return <SignIn classes={classes} />;
};
export default SignIn2;
