
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useAlert } from "react-alert";
import AuthHOC from '../components/401-hoc/401-hoc';
import ConfigComparisonComponent from '../components/config-comparison/config-comparison';
import ErrorContext from '../context/error-context';
import { setup } from '../libs/csrf';
import { autoLogout, shallMock } from '../utils/token';

const ConfigComparisonPage = (props) => {
  if (shallMock(props.isTesting)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }
  const contextE = React.useContext(ErrorContext);
  const alert = useAlert();

  useEffect(() => {
    autoLogout(props, alert);
    if (contextE.error.length > 0) {
      alert.error(contextE.error);
    }
  }, [contextE]);

  const user = props.user;

  return (
    <>
      <Head>
        <title>ARTEMIS - Configuration Comparison</title>
      </Head>
      <div id="page-container">
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'black' }}>Configuration Comparison</h1>{' '}
                  </div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10">
                <ConfigComparisonComponent />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthHOC(ConfigComparisonPage, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, isTesting: process.env.TESTING === 'true', _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
