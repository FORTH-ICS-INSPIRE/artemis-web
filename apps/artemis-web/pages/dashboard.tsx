import { Button } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import OngoingHijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import StatisticsTable from '../components/statistics-table/statistics-table';
import StatusTable from '../components/status-table/status-table';
import { useGraphQl } from '../utils/hooks/use-graphql';

const DashboardPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../utils/mock-sw/browser');
      worker.start();
    }
  }

  const user = props.user;
  const notify = (message: React.ReactText) => toast(message);

  const STATS_DATA = useGraphQl('stats', props.isProduction);
  const HIJACK_DATA = useGraphQl('ongoing_hijack', props.isProduction);
  const INDEX_DATA = useGraphQl('index_stats', props.isProduction);

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
                          if (HIJACK_DATA && HIJACK_DATA.view_hijacks) {
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
                  <div className="card-body">
                    <OngoingHijackTableComponent
                      data={HIJACK_DATA ? HIJACK_DATA.view_hijacks : []}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '20px' }}>
              <div className="col-lg-1" />
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> System Status </div>
                  <div className="card-body">
                    <StatusTable data={STATS_DATA} />
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> Statistics </div>
                  <div className="card-body">
                    <StatisticsTable data={INDEX_DATA} />
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

export default NotFoundHOC(DashboardPage, ['admin', 'user']);
