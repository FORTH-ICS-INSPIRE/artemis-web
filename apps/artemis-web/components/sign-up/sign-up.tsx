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
import React, { useState } from 'react';

const SignUp = (props) => {
  const { classes } = props;
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
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
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-3xl bg-white py-8 px-4 shadow sm:px-10">


            <div className="flex-auto px-4 lg:px-10 space-y-6">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">Get Started</h2>

              <form>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Username"
                    style={{ transition: "all .15s ease" }}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email"
                    style={{ transition: "all .15s ease" }}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    placeholder="Password"
                    style={{ transition: "all .15s ease" }}
                  />
                </div>

                <div className="text-center mt-12">
                  <button
                    className="hover:bg-logo-mandy border border-transparent rounded-md shadow-sm bg-logo-crimson text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                  >
                    Sign up
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-wrap mt-6">
            <div className="w-1/2">
              {/* <a
                href="#pablo"
                onClick={e => e.preventDefault()}
                className="text-gray-300"
              >
                <small>Forgot password?</small>
              </a> */}
            </div>
            <div className="w-1/2 text-right">
              <a
                href="/login"
                className="text-gray-500 hover:text-logo-crimson"
              >
                <small>Already have an account? Login</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

const SignUpComponent = (props) => {
  const classes = useStyles();
  return <SignUp classes={classes} {...props} />;
};

export default SignUpComponent;
