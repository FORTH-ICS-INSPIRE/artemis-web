import Head from 'next/head';
import React from 'react';
import { useJWT } from '../hooks/useJWT';
import { useRouter } from 'next/router';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const PendingPage = (props) => {
  const [user, loading] = useJWT();

  const router = useRouter();
  if (!user && !loading) router.push('signin');

  return (
    <NotFoundHOC user={user} ACL={['pending']}>
      <Head>
        <title>ARTEMIS - Pending</title>
      </Head>
      <div id="pending-container">
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div> Please wait for approval... </div>
        </div>
      </div>
    </NotFoundHOC>
  );
};

export default PendingPage;
