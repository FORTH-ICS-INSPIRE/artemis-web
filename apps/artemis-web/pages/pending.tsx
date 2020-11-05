import Head from 'next/head';
import React from 'react';
import withAuth from '../components/with-auth/with-auth';
import { getUser } from '../lib/helpers';

const PendingPage = (props) => {
  const [user, loading] = getUser();

  return (
    <>
      <Head>
        <title>ARTEMIS - Pending</title>
      </Head>
      <div id="pending-container">
        {!user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div> Please wait for approval... </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(PendingPage, 'RINA', ['pending']);
