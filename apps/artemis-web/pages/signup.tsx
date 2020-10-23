import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUser } from '../lib/hooks';
import Flexbox from 'flexbox-react';

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
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <Flexbox flexDirection="column" minHeight="100vh" alignItems="center">
        <Header />
        <Flexbox flexGrow={1}>
          {!user && !loading && (
            <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
              <div className="container d-flex align-items-center flex-column">
                <SignUpComponent />
              </div>
            </div>
          )}
        </Flexbox>
        <Footer />
      </Flexbox>
    </>
  );
};

export default SignupPage;
