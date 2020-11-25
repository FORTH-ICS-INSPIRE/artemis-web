import {
  deepOrange,
  deepPurple,
  lightBlue,
  orange,
} from '@material-ui/core/colors';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
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
    marginTop: _theme.spacing(3),
  },
  submit: {
    margin: _theme.spacing(3, 0, 2),
  },
  input: {
    color: '#ffff',
  },
}));

const PasswordChange = (props) => {
  const { classes } = props;
  const [errorMsg] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <img
            width="150"
            src="./login.png"
            alt="avatar"
            className="img-responsive"
          />
          <Typography className={classes.input} component="h1" variant="h5">
            Change Password
          </Typography>
          <form method="post" className={classes.form}>
            {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
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
                  autoFocus
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
            >
              Change Password
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

const PasswordChangeComponent = () => {
  const classes = useStyles();
  return <PasswordChange classes={classes} />;
};

export default PasswordChangeComponent;
