import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useCurrentUser } from '../lib/hooks';

const SignupPage: React.FunctionComponent<{}> = () => {
  const [user] = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push('/');
  }, [user]);

  const Footer = dynamic(() => import('../components/footer/footer'));
  const SignUpComponent = dynamic(() => import('../components/sign-up/sign-up'));
  const Header = dynamic(() => import('../components/header/header'));
  return (
    <>
      <Head>
        overview
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        <Header />
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          {!user && (
            <div className="container d-flex align-items-center flex-column">
              <SignUpComponent />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SignupPage;
