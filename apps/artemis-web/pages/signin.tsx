import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import withAuth, { getProps } from '../HOC/withAuth';

const SigninPage = (props) => {
  const user = props.user;

  const SignInComponent = dynamic(() =>
    import('../components/sign-in/sign-in')
  );

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <SignInComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

// export async function getServerSideProps(ctx) {
//   return getProps(ctx);
// }

export default withAuth(SigninPage, ['pending']);
