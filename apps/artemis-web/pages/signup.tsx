import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useJWT } from '../utils/hooks/use-jwt';

const SignupPage = (props) => {
  const SignUpComponent = dynamic(() =>
    import('../components/sign-up/sign-up')
  );

  const [user, loading] = useJWT();
  const router = useRouter();
  if (user && !loading) {
    if (user.role === 'pending') {
      router.push('/pending');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Head>
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="login-container">
        {!user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <SignUpComponent />
          </div>
        )}
      </div>
    </>
  );
};

export default SignupPage;
