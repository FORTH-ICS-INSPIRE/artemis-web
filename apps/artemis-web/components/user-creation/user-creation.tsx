import { Button, Grid, TextField, Typography } from '@material-ui/core';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import 'react-nice-input-password/dist/react-nice-input-password.css';
import NiceInputPassword from 'react-nice-input-password';

const UserCreationComponent = (props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const NiceInputPassword2: NiceInputPassword = dynamic(() => import('react-nice-input-password'), { ssr: false });

  const NiceInputPassword3 = React.memo((props) => {
    const [passState, setPassState] = useState({ password: "" });
    const handleChange = (data: any) => {
      setPassState({
        password: data.value,
      });
    }
    return <NiceInputPassword2
      name="new_password"
      id="new_password"
      value={passState.password}
      onChange={handleChange}
      showSecurityLevelBar
      showSecurityLevelDescription
      autoComplete="current-password"
      LabelComponent={"Password"}
      InputComponent={TextField}
      InputComponentProps={{
        variant: 'outlined',
        name: "new_password",
        label: "New Password",
        fullWidth: true,
        required: true,
        InputProps: {
          endAdornment: <LockIcon />,
        }
      }}
      // showSecurityLevelDescription
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const new_password = e.currentTarget.new_password.value;
    const username = e.currentTarget.username.value;

    const res = await fetch('/api/usermanagement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        userName: username,
        email: email,
        new_password: new_password,
        _csrf: props._csrf,
      }),
    });

    if (res.status === 200) {
      window.location.reload();
      setSuccessMsg((await res.json()).message);
      setErrorMsg('');
    } else {
      setErrorMsg((await res.json()).message);
      setErrorMsg((await res.json()).message);
      setSuccessMsg('');
    }
  };

  return (
    <form id="password_change_form" method="post" onSubmit={handleSubmit}>
      {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
      {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}
      <div className="row">
        <div className="col-lg-9 offset-lg-1" style={{ fontWeight: 'bold' }}>
          Credentials for the new user:
        </div>
      </div>
      <div className="row" style={{ marginTop: '30px' }}>
        <div className="col-lg-9 offset-lg-1">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="text"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                type="text"
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                variant="outlined"
                required
                fullWidth
                id="new_password"
                label="New Password"
                name="new_password"
                type="password"
              /> */}
              <NiceInputPassword3
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-lg-9 offset-lg-1">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="material-button"
            // color="primary"
            // className={classes.submit}
            id="submit"
          >
            Create User
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserCreationComponent;
