import Head from 'next/head';
import React from 'react';
import withAuth from '../components/with-auth/with-auth';

const AdminPanelPage = (props) => {
  const user = props.user;

  return (
    <>
      <Head>
        <title>ARTEMIS - Admin</title>
      </Head>
      <div id="pending-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div> Welcome to admin dashboard... </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(AdminPanelPage, 'RINA', ['admin']);
