import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';

const UsersPasswordComponent = (props) => {
  const users = props.data;
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const new_password = e.currentTarget.new_password.value;
    const username = e.currentTarget.username.value;

    const res = await fetch('/api/usermanagement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'changePass',
        userName: username,
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
          Select user to change her password:
        </div>
      </div>
      <div className="row" style={{ marginTop: '30px' }}>
        <div className="col-lg-9 offset-lg-1">
          <select
            // ref={promoteRef as React.RefObject<HTMLSelectElement>}
            className="form-control"
            id="distinct_values_selection"
            name="username"
          >
            {users.map((user, i) => (
              <option key={`5${i}`}>{user.name}</option>
            ))}
          </select>
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
                id="new_password"
                label="New Password"
                name="new_password"
                type="password"
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
            // color="primary"
            className="material-button"
            // className={classes.submit}
            id="submit"
          >
            Change Password
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UsersPasswordComponent;
