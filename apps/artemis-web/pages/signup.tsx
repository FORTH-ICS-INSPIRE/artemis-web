import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import withAuth, { getProps } from '../HOC/withAuth';

const SignupPage = (props) => {
  const SignUpComponent = dynamic(() =>
    import('../components/sign-up/sign-up')
  );
  const user = props.user;

  const router = useRouter();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push('/overview');
  }, [user, router]);

  return (
    <>
      <Head>
        overview
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="container d-flex align-items-center flex-column">
              <SignUpComponent />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  return getProps(ctx);
}

export default withAuth(SignupPage);
