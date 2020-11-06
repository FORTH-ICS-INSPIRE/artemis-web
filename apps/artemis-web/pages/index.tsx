import React from 'react';
import { useJWT } from '../hooks/useJWT';
import { useRouter } from 'next/router';

const HomePage = (props) => {
  const [user, loading] = useJWT();
  const router = useRouter();
  if (user && !loading && router) {
    if (user.role === 'pending') router.push('pending');
    else router.push('overview');
  } else if (!user && !loading && router) {
    router.push('/signin');
  }
  return <div> Loading... </div>;
};

export default HomePage;
