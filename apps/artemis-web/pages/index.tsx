import React from 'react';
import withAuth from '../components/with-auth/with-auth';

const HomePage = (props) => {
  return <div> Loading... </div>;
};

export default withAuth(HomePage, 'R');
