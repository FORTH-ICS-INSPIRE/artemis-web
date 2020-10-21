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

  const Footer = dynamic(() => import('../components/footer/footer'));
  const SignInComponent = dynamic(() =>
    import('../components/sign-in/sign-in')
  );
  const Header = dynamic(() => import('../components/header/header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
      </Head>
      <div id="login-container">
        <Header />
        {!user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <SignInComponent />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default SigninPage;
