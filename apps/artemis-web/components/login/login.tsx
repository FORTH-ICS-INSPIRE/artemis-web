import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, useStyles } from '../../utils/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Login = (props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    captcha: ''
  });

  async function fetchMyCAPTCHA() {
    const res = await fetch('/api/captcha', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      const svg = await res.json();
      setCaptcha({ svg: svg.svg, encryptedExpr: svg.encryptedExpr });
    } else {
      const msg = await res.text();
      setErrorMsg(msg);
    }
  }

  const [captcha, setCaptcha] = useState({ svg: '', encryptedExpr: '' });
  const router = useRouter();

  async function onClick(e, endpoint) {
    e.preventDefault();

    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, _csrf: props._csrf, encryptedExpr: captcha.encryptedExpr }),
    });

    if (res.status === 200) {
      localStorage.setItem('login_timestamp', new Date().toString());
      const token = await res.json();
      if (token.user.role === 'pending') {
        router.push('/pending');
      } else {
        router.push('/dashboard');
      }
      window.location.reload();
    } else {
      const msg = await res.text();
      setErrorMsg(msg);
      fetchMyCAPTCHA();
    }
  }

  useEffect(() => {
    fetchMyCAPTCHA();
  }, []);

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
            Sign In
          </Typography>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <form method="post" className="login-form">
            <input name="stype" type="hidden" defaultValue="login" />
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <img style={{ marginRight: '40px' }} src={`data:image/svg+xml;utf8,${encodeURIComponent(captcha.svg)}`} />
            <TextField
              variant="outlined"
              margin="normal"
              required
              style={{ width: '300px' }}
              id="captcha"
              color="primary"
              label="Captcha"
              name="captcha"
              autoComplete="captcha"
              autoFocus
              onChange={(e) =>
                setFormData({ ...formData, captcha: e.target.value })
              }
            />
            <br />
            <FormControlLabel
              className={props.classes.input}
              control={
                <Checkbox
                  value="remember"
                  name="remember"
                  color="primary"
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={props.classes.submit}
              onClick={(e) => onClick(e, '/api/auth/login/credentials')}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              id="ldap_login"
              className={props.classes.submit}
              onClick={(e) => onClick(e, '/api/auth/login/ldap')}
            >
              Login with LDAP
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

const LoginComponent = (props) => {
  const classes = useStyles();
  return <Login {...props} classes={classes} />;
};
export default LoginComponent;
