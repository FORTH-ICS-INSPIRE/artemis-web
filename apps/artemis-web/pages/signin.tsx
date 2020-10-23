import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useUser } from '../lib/hooks';
import { useRouter } from 'next/router';
import Flexbox from 'flexbox-react';

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
      </Head>
      <Flexbox flexDirection="column" minHeight="100vh" alignItems="center">
        {/*  */}
        <Header />
        <Flexbox flexGrow={1}>
          {!user && !loading && (
            <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
              <SignInComponent />
            </div>
          )}
        </Flexbox>
        <Footer />
      </Flexbox>
    </>
  );
};

export default SigninPage;
