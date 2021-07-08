import { Card, CardBody } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from "../components/401-hoc/401-hoc";
import ErrorBoundary from "../components/error-boundary/error-boundary";
import OngoingHijackTableComponent from "../components/ongoing-hijack-table/ongoing-hijack-table";
import StatisticsTable from "../components/statistics-table/statistics-table";
import StatusTable from "../components/status-table/status-table";
import { setup } from "../libs/csrf";
import { useGraphQl } from '../utils/hooks/use-graphql';
import { autoLogout, formatDate, shallMock } from '../utils/token';


function WelcomeBanner(props) {

  return (
    <>
      <div className="relative w-1/2 inline-block bg-logo-mandy p-4 sm:p-6 rounded-sm overflow-hidden mb-8">

        {/* Background illustration */}
        <div className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block" aria-hidden="true">
        </div>

        {/* Content */}
        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-1">Welcome back, {props.user.name}. 👋</h1>
          <p>Here is what’s happening in your network today:</p>
        </div>

      </div>
      <div className="relative w-5/12 inline-block float-right bg-logo-mandy p-4 sm:p-6 rounded-sm overflow-hidden mb-8">

        {/* Background illustration */}
        <div className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block" aria-hidden="true">
        </div>

        {/* Content */}
        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-1">Your last login:</h1>
          <p>At {formatDate(new Date(props.user.lastLogin), Math.abs(new Date().getTimezoneOffset() / 60))}. You are {props.user.role}.</p>
        </div>

      </div>
    </>
  );
}

const DashboardPage = (props: any) => {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [profile, setProfile] = useState(false);

  // useEffect(() => {
  //   autoLogout(props);
  // }, [props]);

  if (shallMock()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const [isLive, setIsLive] = useState(true);

  const user = props.user;
  console.log(user)
  // const notify = (message: React.ReactText) => toast(message);

  const STATS_RES: any = useGraphQl('stats', {
    isLive: true,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const STATS_DATA = STATS_RES.data;

  const INDEX_RES: any = useGraphQl('indexStats', {
    isLive: true,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const INDEX_DATA = INDEX_RES.data;

  return (
    <div className="absolute w-full h-full">
      {/* Page title ends */}
      <div className="w-3/4 mx-auto mx-auto px-6">
        <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h1>

        <WelcomeBanner user={user}></WelcomeBanner>

        <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Ongoing, Non-Dormant Hijacks</h2>
        <Card className="mb-8 shadow-md">
          <CardBody>
            <OngoingHijackTableComponent {...props} isLive={isLive} />
          </CardBody>
        </Card>

        <div className="w-1/2 pr-8 float-left">
          <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">System Status</h2>
          <Card className="mb-8 shadow-md">
            <CardBody>
              <ErrorBoundary
                containsData={STATS_DATA}
                noDataMessage={'No modules found.'}
                errorImage={true}
                customError={STATS_RES.error}
              >
                <StatusTable data={STATS_DATA} />
              </ErrorBoundary>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/2 pl-8 float-right">
          <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Statistics</h2>
          <Card className="mb-8 shadow-md">
            <CardBody>
              <ErrorBoundary
                containsData={INDEX_DATA}
                noDataMessage={'No statistics found.'}
                customError={INDEX_RES.error}
                errorImage={true}
              >
                <StatisticsTable data={INDEX_DATA} />
              </ErrorBoundary>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default AuthHOC(DashboardPage, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken, _inactivity_timeout: process.env.INACTIVITY_TIMEOUT, system_version: process.env.SYSTEM_VERSION } };
});
