import Head from 'next/head';
import React from 'react';
import AuthHOC from '../components/401-hoc/401-hoc';
import PasswordChangeComponent from '../components/password-change/password-change';
import { setup } from '../libs/csrf';
import { useJWT } from '../utils/hooks/use-jwt';

const PasswordChangePage = (props) => {
  const [user, loading] = useJWT();

  return (
    <>
      <Head>
        <title>ARTEMIS</title>
      </Head>
      <div id="login-container">
        {user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <PasswordChangeComponent {...props} />
          </div>
        )}
      </div>
    </>
  );
};

export default AuthHOC(PasswordChangePage, ['admin', 'user']);

export const getServerSideProps = setup(async () => {
  return { props: {} };
});
