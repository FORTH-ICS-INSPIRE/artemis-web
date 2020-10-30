import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import withAuth, { getProps } from '../HOC/withAuth';
import { useUser } from '../lib/hooks';

const HomePage = (props) => {
  const user = props.user;

  const router = useRouter();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user && router) router.push('/signin');
    else if (router) router.push('/overview');
  }, [user, router]);

  return <div />;
};

// export async function getServerSideProps(ctx) {
//   return getProps(ctx);
// }

export default withAuth(HomePage);
