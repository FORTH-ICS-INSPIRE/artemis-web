import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { setup } from '../libs/csrf';
import { useJWT } from '../utils/hooks/use-jwt';

const LoginPage = (props: any): any => {
  const [user, loading] = useJWT();
  const router = useRouter();
  const hasGoogle = process.env.NEXT_PUBLIC_GOOGLE_ENABLED;

  if (user && !loading) {
    if (user.role === 'pending') {
      router.push('pending');
    } else {
      router.push('/dashboard');
    }
  }
  const LoginComponent = dynamic(() => import('../components/login/login'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      {/* <h1 style={{ display: 'none' }}>Sign In</h1> */}
      <div id="login-container">
        {!user && !loading && (
          <div id="content-wrap">
            <LoginComponent {...props} hasGoogle={hasGoogle} />
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return {
    props: { _csrf: csrftoken, system_version: process.env.SYSTEM_VERSION },
  };
});
