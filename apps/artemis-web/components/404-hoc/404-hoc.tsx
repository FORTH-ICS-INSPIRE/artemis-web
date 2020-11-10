import { useJWT } from '../../hooks/useJWT';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const NotFoundHOC = (WrappedComponent, ACL = []) => {
  const Wrapped = (props) => {
    const [user, loading] = useJWT();
    const router = useRouter();
    if (!user && !loading) router.push('signin');

    if (user && !loading && !ACL.includes(user.role)) {
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
    } else if (!loading) {
      return <WrappedComponent user={user}></WrappedComponent>;
    } else {
      return <> </>;
    }
  };

  return Wrapped;
};

export default NotFoundHOC;
