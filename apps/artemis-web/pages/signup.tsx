import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUser } from '../lib/hooks';

const SignupPage: React.FunctionComponent<{}> = () => {
  const Footer = dynamic(() => import('../components/footer/footer'));
  const SignUpComponent = dynamic(() =>
    import('../components/sign-up/sign-up')
  );
  const Header = dynamic(() => import('../components/header/header'));
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user && !loading) router.push('/');
  }, [user, loading, router]);

  return (
    <>
      <Head>
        overview
        <title>ARTEMIS - Sign Up</title>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
      </Head>
      <div id="page-container">
        <Header />
        {!user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="container d-flex align-items-center flex-column">
              <SignUpComponent />
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default SignupPage;
