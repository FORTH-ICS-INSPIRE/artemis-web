import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import HijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import StatsTable from '../components/stats-table/stats-table';
import { useGraphQl } from '../hooks/useGraphQL';
import { useJWT } from '../hooks/useJWT';

const OverviewPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }
  const [user, loading] = useJWT();

  const router = useRouter();
  if (!user && !loading) router.push('signin');

  const STATS_DATA = useGraphQl('stats', props.isProduction);
  const HIJACK_DATA = useGraphQl('hijack', props.isProduction);

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>
      <div id="page-container" style={{ paddingTop: '120px' }}>
        {user && !loading && (
          <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-10">
                <h1 style={{ color: 'white' }}>Dashboard</h1>{' '}
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
                    <HijackTableComponent
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
                    <StatsTable data={STATS_DATA} />
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header"> Statistics </div>
                  <div className="card-body">
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <td>Monitored Prefixes</td>
                          <td>2</td>
                        </tr>
                        <tr>
                          <td>Monitor Peers</td>
                          <td> 286</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
