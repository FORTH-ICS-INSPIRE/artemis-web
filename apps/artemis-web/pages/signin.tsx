import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import withAuth from '../components/with-auth/with-auth';
import { useRouter } from 'next/router';
import { useJWT } from '../hooks/useJWT';

const SigninPage = (props) => {
  const [jwt, loading] = [props.jwt, props.loading];
  const user = jwt ? jwt.user : null;
  const router = useRouter();

  // useEffect(() => {
  //   // redirect to home if user is authenticated
  //   if (user && user.role === 'pending')
  //       router.push('/pending')
  //     else 
  //       router.push('/overview')
  // }, [user, loading, router]);

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
