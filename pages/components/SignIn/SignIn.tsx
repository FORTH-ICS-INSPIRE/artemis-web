import React, { ReactEventHandler } from 'react';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange, lightBlue, deepOrange, deepPurple } from '@material-ui/core/colors';
// import green from '@material-ui/core/colors/green';
// import AuthService from "../../services/auth.service";
// import Form from "react-validation/build/form";
import cookie from 'js-cookie';
import Router from 'next/router';


const palletType = "dark";
const darkState = false;
const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

const theme = createMuiTheme({
  palette: {
    type: palletType,
    primary: {
      main: mainPrimaryColor
    },
    secondary: {
      main: mainSecondaryColor
    }
  }
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  main: {
    // marginTop: "80px"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    color: "#ffff"
  }
}));


type MyProps = {
  classes: {
    paper: string,
    avatar: string,
    form: string,
    submit: string,
    input: string,
    main: string
  }
};

type MyState = {
  email: string,
  setEmail: string,
  password: string,
  setPassword: string,
  loginError: string,
  setLoginError: string
};

class SignIn extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = { email: "", setEmail: "", password: "", setPassword: "", loginError: "", setLoginError: "" };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  public handleSubmit = (e: any): void => {
    e.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
    this.setState = this.setState.bind(this);

    ((statef) => {
      //call api
      fetch('/api/auth', {
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
          console.log(statef);
          if (data && data.error) {
            statef({ loginError: data.message });
          }
          if (data && data.token) {
            //set cookie
            cookie.set('token', data.token, { expires: 2 });
            Router.push('/');
          }
        });
    }
    )(this.setState);
  }


  render() {
    const classes = this.props.classes;

    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" className={classes.main}>
          <CssBaseline />
          <div className={classes.paper}>
            <img width="150" src={'https://demo.bgpartemis.org/images/log_in.png'} alt="avatar" className="img-responsive" />
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
                onChange={e => this.setState({ "email": e.target.value })}
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
                onChange={e => this.setState({ "password": e.target.value })}
                autoComplete="current-password"
              />
              <FormControlLabel
                className={classes.input}
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {this.state.loginError && <p style={{ color: 'red' }}>{this.state.loginError}</p>}
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
                <Grid style={{ textAlign: "left" }} item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                        </Link>
                </Grid>
                <Grid item>
                  <Link color="primary" href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
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
  return (
    <SignIn classes={classes} />
  )
};
export default SignIn2;
