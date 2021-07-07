import { Card, CardBody } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { autoLogout, shallMock } from '../utils/token';


function WelcomeBanner() {
  return (
    <>
      <div className="relative w-1/2 inline-block bg-logo-mandy p-4 sm:p-6 rounded-sm overflow-hidden mb-8">

        {/* Background illustration */}
        <div className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block" aria-hidden="true">
        </div>

        {/* Content */}
        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-1">Welcome back, Acme Inc. 👋</h1>
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
          <p>At 7/3/2021 6:36:16 PM. You are user.</p>
        </div>

      </div>
    </>
  );
}

export default function Dashboard(props: any) {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [profile, setProfile] = useState(false);

  // useEffect(() => {
  //   autoLogout(props);
  // }, [props]);

  // if (shallMock()) {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const { worker } = require('../utils/mock-sw/browser');
  //   worker.start();
  // }

  const [isLive, setIsLive] = useState(true);

  const user = props.user;
  // const notify = (message: React.ReactText) => toast(message);

  // const STATS_RES: any = useGraphQl('stats', {
  //   isLive: true,
  //   hasDateFilter: false,
  //   hasColumnFilter: false,
  // });
  // const STATS_DATA = STATS_RES.data;

  // const INDEX_RES: any = useGraphQl('indexStats', {
  //   isLive: true,
  //   hasDateFilter: false,
  //   hasColumnFilter: false,
  // });
  // const INDEX_DATA = INDEX_RES.data;

  return (
    <>
      <div className="absolute bg-gray-200 w-full h-full">
        {/* Page title ends */}
        <div className="container mx-auto px-6">
          <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h1>

          {/* <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Activity</h2> */}
          <WelcomeBanner></WelcomeBanner>
          {/* <Card className="mb-8 shadow-md">
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back guest@guest.com, 
              </p>
            </CardBody>
          </Card> */}
        </div>
      </div>
    </>
  );
}
