import Head from 'next/head';
import React from 'react';
import { useJWT } from '../hooks/useJWT';
import { useRouter } from 'next/router';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const AdminPanelPage = (props) => {
  const [user, loading] = useJWT();

  const router = useRouter();
  if (!user && !loading) router.push('signin');

  return (
    <NotFoundHOC user={user} ACL={['admin']}>
      <Head>
        <title>ARTEMIS - Admin</title>
      </Head>
      <div id="pending-container">
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div> Welcome to admin dashboard... </div>
        </div>
      </div>
    </NotFoundHOC>
  );
};

export default AdminPanelPage;
