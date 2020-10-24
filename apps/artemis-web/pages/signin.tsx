import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useUser } from '../lib/hooks';
import { useRouter } from 'next/router';

const SigninPage: React.FunctionComponent<{}> = () => {
  const [user, { loading }] = useUser();
  const router = useRouter();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user && !loading) router.push('/');
  }, [user, loading, router]);

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
            <SignInComponent />
          </div>
        )}
      </div>
    </>
  );
};

export default SigninPage;
