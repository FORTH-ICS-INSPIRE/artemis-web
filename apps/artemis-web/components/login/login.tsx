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
import React, { useState } from 'react';

const Login = (props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
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
      body: JSON.stringify({ ...formData, _csrf: props._csrf }),
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
    }
  }

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 mt-16">
            <img
              className="mx-auto h-12 w-auto"
              src="./aletter.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
          </div>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 py-8 px-4 shadow sm:rounded-lg sm:px-10">


            <div className="flex-auto px-4 lg:px-10 py-10 pt-10 space-y-6">
              <form>
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
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      id="customCheckLogin"
                      type="checkbox"
                      className="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                      style={{ transition: "all .15s ease" }}
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                      Remember me
                    </span>
                  </label>
                </div>

                <div className="text-center mt-6">
                  <button
                    className="hover:bg-logo-mandy border border-transparent rounded-md shadow-sm bg-logo-crimson text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                  >
                    Sign In
                  </button>

                  <div className="text-gray-500 text-center mb-3 mt-6 font-bold">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-200 text-gray-500">Or login with</span>
                      </div>
                    </div>

                    <button
                      className="mt-6 hover:bg-logo-mandy bg-logo-crimson text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 border border-transparent rounded-md shadow-sm rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 w-full"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                    >
                      LDAP Login
                    </button>
                  </div>

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
                href="/signup"
                className="text-gray-500 hover:text-logo-crimson"
              >
                <small>Dont have an account? Sign Up</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );

};

const LoginComponent = (props) => {
  const classes = useStyles();
  return <Login {...props} classes={classes} />;
};
export default LoginComponent;
