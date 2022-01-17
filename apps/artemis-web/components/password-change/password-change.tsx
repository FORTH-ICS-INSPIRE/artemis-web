import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, useStyles } from '../../utils/styles';
import React, { useState } from 'react';

const PasswordChange = (props) => {
  const { classes } = props;
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const old_password = e.currentTarget.old_password.value;
    const new_password = e.currentTarget.new_password.value;
    const repeat_password = e.currentTarget.repeat_password.value;

    if (new_password !== repeat_password) {
      setSuccessMsg('');
      setErrorMsg('New password and repeat password must be the same');
      return;
    }

    const body = {
      old_password: old_password,
      new_password: new_password,
      _csrf: props._csrf,
    };

    const res = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setSuccessMsg(
        (await res.json()).message +
          '\n Please login with your new credentials.'
      );
      setErrorMsg('');
      await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _csrf: props._csrf }),
      });
      setTimeout(() => (document.location.href = '/login'), 3000);
    } else {
      setErrorMsg((await res.json()).message);
      setSuccessMsg('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <img
            width="150"
            src="./password.png"
            alt="avatar"
            className="img-responsive"
          />
          <Typography className={classes.input} component="h1" variant="h5">
            Change Password
          </Typography>
          <form
            id="password_change_form"
            method="post"
            onSubmit={handleSubmit}
            className="login-form"
          >
            {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
            {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}

            <input name="emailVerified" type="hidden" defaultValue={'true'} />
            <input name="stype" type="hidden" defaultValue="signup" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="old_password"
                  label="Old Password"
                  autoComplete="current-password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="new_password"
                  label="New Password"
                  name="new_password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="repeat_password"
                  label="Repeat Password"
                  type="password"
                  id="repeat_password"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              id="submit"
            >
              Change Password
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

const PasswordChangeComponent = (props) => {
  const classes = useStyles();
  return <PasswordChange classes={classes} {...props} />;
};

export default PasswordChangeComponent;
