import { Button } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import OngoingHijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import StatisticsTable from '../components/statistics-table/statistics-table';
import StatusTable from '../components/status-table/status-table';
import { useGraphQl } from '../utils/hooks/use-graphql';
import ErrorBoundary from '../components/error-boundary/error-boundary';

const DashboardPage = (props) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';

  if (isDevelopment && isBrowser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const user = props.user;
  const notify = (message: React.ReactText) => toast(message);

  const STATS_RES = useGraphQl('stats');
  const STATS_DATA = STATS_RES.data;
  const HIJACK_RES = useGraphQl('ongoing_hijack');
  const HIJACK_DATA = HIJACK_RES.data;
  let hijacks = HIJACK_DATA ? HIJACK_DATA.view_hijacks : [];
  const INDEX_RES = useGraphQl('index_stats');
  const INDEX_DATA = INDEX_RES.data;

  hijacks = hijacks.map((entry, i) => ({
    ...entry,
    id: i,
  }));

  return (
    <>
      <Head>
        <title>ARTEMIS - Dashboard</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'white' }}>Dashboard</h1>{' '}
                  </div>
                  <div className="col-lg-1">
                    {process.env.NODE_ENV === 'development' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (hijacks.length) {
                            notify(`Example notification !`);
                          }
                        }}
                      >
                        {' '}
                        NOTIFY ME!
                      </Button>
                    )}
                  </div>
                </div>
                <hr style={{ backgroundColor: 'white' }} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="card">
                  <div className="card-header">Activity</div>
                  <div className="card-body">
                    Welcome back <b>{user && user.name}</b>, your last login was
                    at (
                    {user &&
                      new Date(user.lastLogin).toLocaleDateString() +
                        ' ' +
                        new Date(user.lastLogin).toLocaleTimeString()}
                    ). You are {user && user.role}.
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="card">
                  <div className="card-header">
                    Ongoing, Non-Dormant Hijacks{' '}
                  </div>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    {' '}
                    <ErrorBoundary
                      containsData={hijacks.length > 0}
                      noDataMessage={'No hijack alerts.'}
                      customError={HIJACK_RES.error}
                    >
                      <OngoingHijackTableComponent data={hijacks} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-lg-1" />
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> System Status </div>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <ErrorBoundary
                      containsData={STATS_DATA}
                      noDataMessage={'No modules found.'}
                      customError={STATS_RES.error}
                    >
                      <StatusTable data={STATS_DATA} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> Statistics </div>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <ErrorBoundary
                      containsData={INDEX_DATA}
                      noDataMessage={'No statistics found.'}
                      customError={INDEX_RES.error}
                    >
                      <StatisticsTable data={INDEX_DATA} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
};

export default AuthHOC(DashboardPage, ['admin', 'user']);
