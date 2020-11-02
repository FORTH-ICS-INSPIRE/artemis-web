import dynamic from 'next/dynamic';
import Head from 'next/head';
import withAuth from '../components/with-auth/withAuth';
import React from 'react';

const SignupPage = (props) => {
  const SignUpComponent = dynamic(() =>
    import('../components/sign-up/sign-up')
  );

  const user = props.user;

  return (
    <>
      <Head>
        overview
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="container d-flex align-items-center flex-column">
              <SignUpComponent />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(SignupPage, []);
