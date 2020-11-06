import Head from 'next/head';
import React from 'react';
import { useJWT } from '../hooks/useJWT';

const AdminPanelPage = (props) => {
  const [user, loading] = useJWT();

  return (
    <>
      <Head>
        <title>ARTEMIS - Admin</title>
      </Head>
      <div id="pending-container">
        {user && user.role === 'admin' && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div> Welcome to admin dashboard... </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanelPage;
