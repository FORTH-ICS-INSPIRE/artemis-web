import Head from 'next/head';
import React, { useEffect } from 'react';
import AuthHOC from '../components/401-hoc/401-hoc';
import PasswordChangeComponent from '../components/password-change/password-change';
import { setup } from '../libs/csrf';
import { useJWT } from '../utils/hooks/use-jwt';
import { autoLogout } from '../utils/token';

const PasswordChangePage = (props) => {
  const [user, loading] = useJWT();

  useEffect(() => {
    autoLogout(props);
  }, [props]);

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

export default AuthHOC(PasswordChangePage, ['admin', 'user'], 'ldap-user');

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return {
    props: {
      _csrf: csrftoken,
      _inactivity_timeout: process.env.INACTIVITY_TIMEOUT,
      system_version: process.env.SYSTEM_VERSION,
    },
  };
});
