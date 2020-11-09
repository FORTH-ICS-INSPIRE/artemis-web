import Head from 'next/head';
import React from 'react';
import { useJWT } from '../hooks/useJWT';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';

const AdminPanelPage = (props) => {
  const [user, loading] = useJWT();

  const router = useRouter();
  if (!user && !loading) router.push('signin');

  if (user && user.role !== 'admin') {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage
          statusCode={404}
          title={'You do not have the permission to access'}
        />
      </>
    );
  }

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
