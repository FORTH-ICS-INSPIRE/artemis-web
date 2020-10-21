import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUser } from '../lib/hooks';

const HomePage: React.FunctionComponent<{}> = () => {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user && !loading) router.push('/signin');
    else if (router) router.push('/overview');
  }, [user, loading, router]);

  return <div />;
};

export default HomePage;
