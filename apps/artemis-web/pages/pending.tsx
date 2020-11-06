import Head from 'next/head';
import React from 'react';
import { useJWT } from '../hooks/useJWT';
import { useRouter } from 'next/router';

const PendingPage = (props) => {
  const [user, loading] = useJWT();

  const router = useRouter();
  if (!user && !loading) router.push('signin');

  return (
    <>
      <Head>
        <title>ARTEMIS - Pending</title>
      </Head>
      <div id="pending-container">
        {user && user.role === 'pending' && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div> Please wait for approval... </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingPage;
