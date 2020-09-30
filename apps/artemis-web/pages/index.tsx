import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useCurrentUser } from '../lib/hooks';

const HomePage: React.FunctionComponent<{}> = () => {
  const [user] = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user) router.push('/signin');
    else router.push('/overview');
  }, [user]);

  return <div />;
};

export default HomePage;
