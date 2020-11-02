import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import withAuth from '../components/with-auth/with-auth';

const SigninPage = (props) => {
  const user = props.user;

  const SignInComponent = dynamic(() =>
    import('../components/sign-in/sign-in')
  );

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <SignInComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(SigninPage, 'RIA');
