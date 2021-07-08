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
    <div className="container mx-auto px-4 h-full pt-24">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          {/* <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 mt-16">
            <img
              className="mx-auto h-12 w-auto"
              src="./aletter.png"
              alt="Workflow"
            />
          </div> */}
          <div className="relative flex flex-col min-w-0 break-words bg-gray-100 dark:bg-gray-600 w-full mb-6 shadow-lg rounded-3xl py-8 px-4 shadow sm:px-10">


            <div className="flex-auto px-4 lg:px-10 space-y-6">
              <h2 className="text-center text-3xl mb-16 font-extrabold text-gray-900 dark:text-gray-50">Login To Your Account</h2>
              {errorMsg && <p className="error">{errorMsg}</p>}
              <form>
                <div className="flex relative w-full mb-3 ">
                  <span className="rounded-l-md inline-flex  items-center px-3 py-4 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z">
                      </path>
                    </svg>
                  </span>
                  <input type="text" id="sign-in-email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    } className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Your email" />
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
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      type="password" id="sign-in-email" className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Your password" />
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      id="customCheckLogin"
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-logo-crimson"
                      style={{ transition: "all .15s ease" }}
                      onChange={(e) =>
                        setFormData({ ...formData, rememberMe: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Remember me
                    </span>
                  </label>
                </div>

                <div className="text-center mt-6">
                  <button
                    className="py-3 px-4  hover:bg-logo-mandy bg-logo-crimson focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                    type="submit"
                    style={{ transition: "all .15s ease" }}
                    onClick={(e) => onClick(e, '/api/auth/login/credentials')}
                  >
                    Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  <div className="text-gray-500 text-center mb-3 mt-6 font-bold">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-50">OR</span>
                      </div>
                    </div>

                    <button
                      className="py-3 px-4 mt-6 hover:bg-logo-mandy bg-logo-crimson focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                      type="submit"
                      id="ldap_login"
                      onClick={(e) => onClick(e, '/api/auth/login/ldap')}
                      style={{ transition: "all .15s ease" }}
                    >
                      LDAP Login
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
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
                className="text-gray-700 dark:text-gray-100 hover:text-logo-crimson"
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
