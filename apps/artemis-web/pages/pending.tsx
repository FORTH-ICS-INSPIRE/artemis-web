import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const PendingPage = () => {
  return (
    <>
      <Head>
        <title>ARTEMIS - Pending</title>
      </Head>
      <div id="pending-container">
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div> Please wait for approval... </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundHOC(PendingPage, ['pending']);
