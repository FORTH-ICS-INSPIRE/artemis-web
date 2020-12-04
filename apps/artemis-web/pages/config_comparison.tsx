import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import ConfigComparisonComponent from '../components/config-comparison/config-comparison';
import { useJWT } from '../utils/hooks/use-jwt';

const ConfigComparisonPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../utils/mock-sw/browser');
      worker.start();
    }
  }
  const user = props.user;

  return (
    <>
      <Head>
        <title>ARTEMIS - Configuration Comparison</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'white' }}>Configuration Comparison</h1>{' '}
                  </div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10">
                <ConfigComparisonComponent></ConfigComparisonComponent>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotFoundHOC(ConfigComparisonPage, ['admin', 'user']);
