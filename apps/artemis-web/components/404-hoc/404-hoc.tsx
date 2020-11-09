import React from 'react';
import Head from 'next/head';
import DefaultErrorPage from 'next/error';

const NotFoundHOC = (props) => {
  if (props.user && !props.ACL.includes(props.user.role)) {
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
  } else {
    return props.children;
  }
};

export default NotFoundHOC;
