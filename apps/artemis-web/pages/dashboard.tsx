import { FormControlLabel, FormGroup } from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Media from 'react-media';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthHOC from '../components/401-hoc/401-hoc';
import ErrorBoundary from '../components/error-boundary/error-boundary';
import OngoingHijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import StatisticsTable from '../components/statistics-table/statistics-table';
import StatusTable from '../components/status-table/status-table';
import { setup } from '../libs/csrf';
import { useGraphQl } from '../utils/hooks/use-graphql';
import { AntSwitch } from '../utils/styles';
import { autoLogout, GLOBAL_MEDIA_QUERIES, shallMock } from '../utils/token';

const DashboardPage = (props: any) => {
  useEffect(() => {
    autoLogout(props);
  }, [props]);

  if (shallMock(props.isTesting)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { worker } = require('../utils/mock-sw/browser');
    worker.start();
  }

  const [isLive, setIsLive] = useState(!shallMock(props.isTesting));

  const user = props.user;
  // const notify = (message: React.ReactText) => toast(message);

  const STATS_RES: any = useGraphQl('stats', {
    isLive: isLive,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const STATS_DATA = STATS_RES.data;

  const INDEX_RES: any = useGraphQl('indexStats', {
    isLive: isLive,
    hasDateFilter: false,
    hasColumnFilter: false,
  });
  const INDEX_DATA = INDEX_RES.data;

  return (
    <>
      <Head>
        <title>ARTEMIS - Dashboard</title>
      </Head>
      <div id="page-container">
        {user && (
          <Media queries={GLOBAL_MEDIA_QUERIES}>
            {(matches) => (
              <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
                <div className="row" role="toolbar">
                  <div className="col-lg-1" />
                  <div className="col-lg-10">
                    <div className="row">
                      <div className="col-lg-8">
                        <h1 style={{ color: 'black' }}>Dashboard</h1>{' '}
                      </div>
                      {matches.pc && (
                        <div className="col-lg-2">
                          <h2 style={{ color: 'black' }}>
                            <label htmlFor="toggle">Live Update:</label>
                          </h2>{' '}
                        </div>
                      )}
                      <div className="col-lg-1">
                        <FormGroup>
                          <AntSwitch
                            id="toggle"
                            onChange={() => {
                              setIsLive(!isLive);
                            }}
                            size="medium"
                            checked={isLive}
                          />
                        </FormGroup>
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
                        Welcome back <b>{user && user.email}</b>, your last
                        login was at{' '}
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
                      <div
                        className="card-body"
                        style={{ textAlign: 'center' }}
                      >
                        {' '}
                        <OngoingHijackTableComponent
                          {...props}
                          isLive={isLive}
                        />
                      </div>
                    </div>
                    <span style={{ float: 'right', marginTop: '15px' }}>
                      Times are shown in your local time zone{' '}
                      <b>
                        GMT{new Date().getTimezoneOffset() > 0 ? '-' : '+'}
                        {Math.abs(new Date().getTimezoneOffset() / 60)} (
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}).
                      </b>
                    </span>
                  </div>
                  {!matches.pc && (
                    <div className="col-lg-4">
                      <div className="card">
                        <div className="card-header"> System Status </div>
                        <div
                          className="card-body"
                          style={{ textAlign: 'center' }}
                        >
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
                        <div
                          className="card-body"
                          style={{ textAlign: 'center' }}
                        >
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
                        <div
                          className="card-body"
                          style={{ textAlign: 'center' }}
                        >
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
                        <div
                          className="card-body"
                          style={{ textAlign: 'center' }}
                        >
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
          </Media>
        )}
      </div>
    </>
  );
};

export default AuthHOC(DashboardPage, ['admin', 'user']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return {
    props: {
      _csrf: csrftoken,
      isTesting: process.env.TESTING === 'true',
      _inactivity_timeout: process.env.INACTIVITY_TIMEOUT,
      system_version: process.env.SYSTEM_VERSION,
    },
  };
});
