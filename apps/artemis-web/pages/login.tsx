import * as React from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/client';
import cookie from 'js-cookie';
import { csrfToken, getSession } from 'next-auth/client';

const Login = ({ csrfToken }) => {
  const [session, loading] = useSession();
  let loggedIn = false;

  if (loading) return <h1>Loading...</h1>;
  // let loggedIn = false;
  if (session) {
    loggedIn = true;
    // Router.push("/overview");
  }

  const Footer = dynamic(() => import('../components/footer/footer'));
  const SignIn2 = dynamic(() => import('../components/sign-in/sign-in'));
  const Header = dynamic(() => import('../components/header/header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        <Header loggedIn={false} call={signOut} />
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <SignIn2 csrf={csrfToken} loggedIn={loggedIn} />
        </div>
        <Footer />
      </div>
    </>
  );
};

Login.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context),
  };
};
export default Login;
