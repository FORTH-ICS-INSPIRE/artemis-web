import React from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { csrfToken } from 'next-auth/client';
import { signOut, useSession } from 'next-auth/client';

const Signup = ({ csrfToken }) => {
  const [session, loading] = useSession();
  let loggedIn = false;

  if (loading) return <h1>Loading...</h1>;

  if (session) {
    loggedIn = true;
    Router.push('/overview');
  }

  const Footer = dynamic(() => import('../components/footer/footer'));
  const SignUp = dynamic(() => import('../components/sign-up/sign-up'));
  const Header = dynamic(() => import('../components/header/header'));
  return (
    <>
      <Head>
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        <Header loggedIn={false} />
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          {!loggedIn && (
            <div className="container d-flex align-items-center flex-column">
              <SignUp csrf={csrfToken} loggedIn={loggedIn} />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

Signup.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context),
  };
};

export default Signup;
