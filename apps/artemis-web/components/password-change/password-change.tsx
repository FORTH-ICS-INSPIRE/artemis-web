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
    <div className="container mx-auto px-4 h-full pt-48">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          {/* <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 mt-16">
            <img
              className="mx-auto h-12 w-auto"
              src="./aletter.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          </div> */}
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-3xl bg-white py-8 px-4 sm:px-10">


            <div className="flex-auto px-4 lg:px-10 space-y-6">
              <h2 className="mb-16 text-center text-3xl font-extrabold text-gray-900">Change Your Password</h2>

              <form>

                <div className="flex flex-col mb-6">
                  {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
                  {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}

                  <div className="flex relative">
                    <span className="rounded-l-md inline-flex  items-center px-3 py-4 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                        </path>
                      </svg>
                    </span>
                    <input

                      type="password" id="old_password" className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Old password" />
                  </div>
                </div>

                <div className="flex flex-col mb-6">
                  <div className="flex relative">
                    <span className="rounded-l-md inline-flex  items-center px-3 py-4 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                        </path>
                      </svg>
                    </span>
                    <input

                      type="password" id="new_password" className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="New password" />
                  </div>
                </div>

                <div className="flex flex-col mb-6">
                  <div className="flex relative">
                    <span className="rounded-l-md inline-flex  items-center px-3 py-4 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                        </path>
                      </svg>
                    </span>
                    <input

                      type="password" id="repeat_password" className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Repeat password" />
                  </div>
                </div>

                <div className="text-center mt-12">
                  <button
                    className="py-3 px-4  hover:bg-logo-mandy bg-logo-crimson focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                    type="submit"
                    style={{ transition: "all .15s ease" }}
                    onSubmit={handleSubmit}
                  >
                    Change Password
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div >
    // <ThemeProvider theme={theme}>
    //   <Container component="main" maxWidth="sm">
    //     <div className={classes.paper}>
    //       <img
    //         width="150"
    //         src="./password.png"
    //         alt="avatar"
    //         className="img-responsive"
    //       />
    //       <Typography className={classes.input} component="h1" variant="h5">
    //         Change Password
    //       </Typography>
    //       <form
    //         id="password_change_form"
    //         method="post"
    //         onSubmit={handleSubmit}
    //         className="login-form"
    //       >
    //         {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
    //         {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}

    //         <input name="emailVerified" type="hidden" defaultValue={'true'} />
    //         <input name="stype" type="hidden" defaultValue="signup" />
    //         <Grid container spacing={2}>
    //           <Grid item xs={12} sm={12}>
    //             <TextField
    //               name="name"
    //               variant="outlined"
    //               required
    //               fullWidth
    //               id="old_password"
    //               label="Old Password"
    //               autoComplete="current-password"
    //               type="password"
    //               autoFocus
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <TextField
    //               variant="outlined"
    //               required
    //               fullWidth
    //               id="new_password"
    //               label="New Password"
    //               name="new_password"
    //               type="password"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <TextField
    //               variant="outlined"
    //               required
    //               fullWidth
    //               name="repeat_password"
    //               label="Repeat Password"
    //               type="password"
    //               id="repeat_password"
    //             />
    //           </Grid>
    //         </Grid>

    //         <Button
    //           type="submit"
    //           fullWidth
    //           variant="contained"
    //           color="primary"
    //           className={classes.submit}
    //           id="submit"
    //         >
    //           Change Password
    //         </Button>
    //       </form>
    //     </div>
    //   </Container>
    // </ThemeProvider>
  );
};

const PasswordChangeComponent = (props) => {
  const classes = useStyles();
  return <PasswordChange classes={classes} {...props} />;
};

export default PasswordChangeComponent;
