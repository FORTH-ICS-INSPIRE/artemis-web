import Head from 'next/head';
import React from 'react';
import NotAuthHOC from '../components/401-hoc/401-hoc';
import PasswordChangeComponent from '../components/password-change/password-change';
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

export default NotAuthHOC(PasswordChangePage, ['admin', 'user']);
