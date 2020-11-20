import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import PasswordChangeComponent from '../components/password-change/password-change';
import { useJWT } from '../hooks/useJWT';

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

export default NotFoundHOC(PasswordChangePage, ['admin', 'user']);
