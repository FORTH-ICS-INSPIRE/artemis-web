import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import LoginComponent from '../components/login/login';
import { setup } from '../libs/csrf';
import { useJWT } from '../utils/hooks/use-jwt';

const LoginPage = (props) => {
  const [user, loading] = useJWT();
  const router = useRouter();
  if (user && !loading) {
    if (user.role === 'pending') {
      router.push('pending');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container" className='bg-gray-50 dark:bg-gray-800'>
        {!user && (
          <div id="content-wrap">
            <LoginComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, system_version: process.env.SYSTEM_VERSION } };
});
