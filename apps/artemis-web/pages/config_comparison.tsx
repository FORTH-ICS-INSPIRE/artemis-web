import { Card, CardBody } from '@windmill/react-ui';
import Head from 'next/head';
import React, { useEffect } from 'react';
import AuthHOC from '../components/401-hoc/401-hoc';
import ConfigComparisonComponent from '../components/config-comparison/config-comparison';
import { setup } from '../libs/csrf';
import { autoLogout, shallMock } from '../utils/token';

const ConfigComparisonPage = (props) => {
  if (shallMock()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }
  useEffect(() => {
    autoLogout(props);
  }, [props]);

  const user = props.user;

  return (
    <>
      <Head>
        <title>ARTEMIS - Configuration Comparison</title>
      </Head>
      <div id="page-container">
        {/* {user && ( */}
        <div className="relative w-full h-full mb-12">
          {/* Page title ends */}
          <div className="w-3/4 mx-auto px-6">
            <h1 className="my-6 inline-block w-full text-2xl font-semibold text-gray-700 dark:text-gray-200">
              <div className="w-1/2 float-left">Configuration Comparison</div>
            </h1>

            {/* <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Ongoing, Non-Dormant Hijacks</h2> */}
            <Card className="mb-8 shadow-md bg-gray-600 dark:bg-gray-50">
              <CardBody>
                <ConfigComparisonComponent />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthHOC(ConfigComparisonPage, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
