import React, { useState } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import Head from 'next/head';

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email) {
    loggedIn = true;
    Router.push('/overview');
  } else {
  }

  const Footer = dynamic(() => import('./components/Footer/Footer'));
  const SignIn2 = dynamic(() => import('./components/SignIn/SignIn'));
  const Header = dynamic(() => import('./components/Header/Header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <Header loggedIn={loggedIn}></Header>
      {!loggedIn &&
        <div className="container d-flex align-items-center flex-column">
          <SignIn2 />
        </div>
      }
      <Footer></Footer>
    </>
  );
};

export default Login;
