import React from 'react';
import withAuth from '../components/with-auth/withAuth';

const HomePage = (props) => {
  return <div> Loading... </div>;
};

export default withAuth(HomePage, ['pending', 'user', 'admin']);
