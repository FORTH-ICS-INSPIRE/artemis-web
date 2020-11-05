import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import withAuth from '../components/with-auth/with-auth';
import { useRouter } from 'next/router';
import { getUser } from '../lib/helpers';

const SigninPage = (props) => {
  const [user, loading] = getUser();
  const router = useRouter();
  if (user && !loading) {
    if (user.role === 'pending') router.push('pending');
    else router.push('overview');
  }
  const SignInComponent = dynamic(() =>
    import('../components/sign-in/sign-in')
  );

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        {!user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <SignInComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

export default SigninPage;
