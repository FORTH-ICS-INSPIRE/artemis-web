import Head from 'next/head';
import React from 'react';
import { useMedia } from 'react-media';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import ErrorBoundary from '../components/error-boundary/error-boundary';
import OngoingHijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import StatisticsTable from '../components/statistics-table/statistics-table';
import StatusTable from '../components/status-table/status-table';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { GLOBAL_MEDIA_QUERIES, shallMock } from '../utils/token';

const DashboardPage = (props) => {
  if (shallMock()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const user = props.user;
  const notify = (message: React.ReactText) => toast(message);

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

  const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });

  return (
    <>
      <Head>
        <title>ARTEMIS - Dashboard</title>
      </Head>
      <div id="page-container">
        {user && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <div className="row">
                  <div className="col-lg-8">
                    <h1 style={{ color: 'black' }}>Dashboard</h1>{' '}
                  </div>
                  {/* <div className="col-lg-1">
                    {process.env.NODE_ENV === 'development' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          // if (hijacks.length) {
                          notify(`Example notification !`);
                          // }
                        }}
                      >
                        {' '}
                        NOTIFY ME!
                      </Button>
                    )}
                  </div> */}
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
                    Welcome back <b>{user && user.email}</b>, your last login
                    was at{' '}
                    <b>
                      (
                      {user &&
                        new Date(user.lastLogin).toLocaleDateString() +
                        ' ' +
                        new Date(user.lastLogin).toLocaleTimeString()}
                      )
                    </b>
                    . You are {user && user.role}.
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-lg-1" />
              <div className={!matches.pc ? 'col-lg-6' : 'col-lg-10'}>
                <div className="card">
                  <div className="card-header">
                    Ongoing, Non-Dormant Hijacks{' '}
                  </div>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    {' '}
                    <OngoingHijackTableComponent isLive={true} />
                  </div>
                </div>
                <span style={{ float: 'right', marginTop: '15px' }}>
                  Times are shown in your local time zone{' '}
                  <b>GMT+2 (Europe/Athens).</b>
                </span>
              </div>
              {!matches.pc && (
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-header"> System Status </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                      <ErrorBoundary
                        containsData={STATS_DATA}
                        noDataMessage={'No modules found.'}
                        errorImage={true}
                        customError={STATS_RES.error}
                      >
                        <StatusTable data={STATS_DATA} />
                      </ErrorBoundary>
                    </div>
                  </div>
                  <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-header"> Statistics </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                      <ErrorBoundary
                        containsData={INDEX_DATA}
                        noDataMessage={'No statistics found.'}
                        customError={INDEX_RES.error}
                        errorImage={true}
                      >
                        <StatisticsTable data={INDEX_DATA} />
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {matches.pc && (
              <div className="row" style={{ marginTop: '20px' }}>
                <div className="col-lg-1" />
                <div className="col-lg-5">
                  <div className="card">
                    <div className="card-header"> System Status </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                      <ErrorBoundary
                        containsData={STATS_DATA}
                        noDataMessage={'No modules found.'}
                        errorImage={true}
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
                        errorImage={true}
                      >
                        <StatisticsTable data={INDEX_DATA} />
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
};

export default AuthHOC(DashboardPage, ['admin', 'user']);
