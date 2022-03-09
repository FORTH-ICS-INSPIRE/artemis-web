import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, useStyles } from '../../utils/styles';
import React, { useEffect, useState } from 'react';
import 'react-nice-input-password/dist/react-nice-input-password.css';
import LockIcon from '@material-ui/icons/Lock';
import dynamic from 'next/dynamic';
import * as NP from 'react-nice-input-password';

const SignUp = (props) => {
  const { classes } = props;
  const [errorMsg, setErrorMsg] = useState('');
  const [captcha, setCaptcha] = useState({ svg: '', encryptedExpr: '' });

  const NiceInputPassword2: NP = dynamic(() => import('react-nice-input-password'), { ssr: false });

  const NiceInputPassword = React.memo((props) => {
    const [passState, setPassState] = useState({ password: "" });
    const handleChange = (data: any) => {
      setPassState({
        password: data.value,
      });
    }
    return <NiceInputPassword2
      name="password"
      id="password"
      value={passState.password}
      onChange={handleChange}
      showSecurityLevelBar
      autoComplete="current-password"
      LabelComponent={"Password"}
      InputComponent={TextField}
      InputComponentProps={{
        variant: 'outlined',
        name: "password",
        label: "Password",
        fullWidth: true,
        required: true,
        InputProps: {
          endAdornment: <LockIcon />,
        }
      }}
      securityLevels={[
        {
          descriptionLabel: <Typography>1 number</Typography>,
          validator: /.*[0-9].*/,
        },
        {
          descriptionLabel: <Typography>1 uppercase</Typography>,
          validator: /.*[A-Z].*/,
        },
        {
          descriptionLabel: <Typography>1 special letter</Typography>,
          validator: /.*[!@#$&*].*/,
        },
        {
          descriptionLabel: <Typography>1 lowecase letter</Typography>,
          validator: /.*[a-z].*/,
        },
        {
          descriptionLabel: <Typography>at least 8</Typography>,
          validator: /.*.{8,}/,
        }
      ]}
    />
  });

  async function fetchMyCAPTCHA() {
    const res = await fetch('/api/captcha', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page: 'signup' }),
    });

    if (res.status === 200) {
      const svg = await res.json();
      setCaptcha({ svg: svg.svg, encryptedExpr: svg.encryptedExpr });
    } else {
      const msg = await res.text();
      setErrorMsg(msg);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
      captcha: e.currentTarget.captcha.value,
      encryptedExpr: captcha.encryptedExpr,
      _csrf: props._csrf,
    };

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      localStorage.setItem('login_timestamp', new Date().toString());
      window.location.reload();
    } else {
      setErrorMsg(await res.text());
      fetchMyCAPTCHA();
    }
  };

  useEffect(() => {
    fetchMyCAPTCHA();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" role="article">
        <div className={classes.paper}>
          <img
            width="150"
            src="./login.png"
            alt="avatar"
            className="img-responsive"
          />
          <h1>Sign up</h1>
          <form method="post" onSubmit={handleSubmit} className="login-form">
            {errorMsg ? <p style={{ color: 'red', whiteSpace: "pre-line" }}>{errorMsg}</p> : null}
            <input name="emailVerified" type="hidden" defaultValue={'true'} />
            <input name="stype" type="hidden" defaultValue="signup" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="username"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <NiceInputPassword />
              </Grid>
              <Grid item xs={12}>
                <img
                  style={{ marginRight: '40px' }}
                  alt="CAPTCHA"
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    captcha.svg
                  )}`}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  style={{ width: '300px' }}
                  id="captcha"
                  color="primary"
                  label="Captcha"
                  name="captcha"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

const SignUpComponent = (props) => {
  const classes = useStyles();
  return <SignUp classes={classes} {...props} />;
};

export default SignUpComponent;
