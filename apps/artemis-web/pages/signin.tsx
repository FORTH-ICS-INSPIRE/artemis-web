import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useUser } from '../lib/hooks';
import { useRouter } from 'next/router';
import withAuth from '../HOC/withAuth';

const SigninPage = (props) => {
  const user = props.user;
  const router = useRouter();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push('/');
  }, [user, router]);

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
            <SignInComponent />
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(SigninPage);
