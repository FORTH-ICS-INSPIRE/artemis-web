import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const AdminPanelPage = () => {
  return (
    <>
      <Head>
        <title>ARTEMIS - Admin</title>
      </Head>
      <div id="pending-container">
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div> Welcome to admin dashboard... </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundHOC(AdminPanelPage, ['admin']);
