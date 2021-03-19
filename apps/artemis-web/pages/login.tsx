import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
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
  const LoginComponent = dynamic(() => import('../components/login/login'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        {!user && !loading && (
          <div id="content-wrap">
            <LoginComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
