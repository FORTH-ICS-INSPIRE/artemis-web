import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import HijackTableComponent from '../components/ongoing-hijack-table/ongoing-hijack-table';
import { useUser } from '../lib/hooks';

const OverviewPage = () => {
  const Footer = dynamic(() => import('../components/footer/footer'));
  const Header = dynamic(() => import('../components/header/header'));
  const [user, { loading }] = useUser();
  const router = useRouter();

  async function populateData() {
    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'stats' }),
    });

    // write code to fill tables with data
    console.log(await res.json());
  }

  populateData();

  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user && !loading) router.push('/signin');
  }, [user, loading, router]);

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>

      <div id="page-container" style={{ paddingTop: '120px' }}>
        <Header />
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
                <div className="card-header">Ongoing, Non-Dormant Hijacks </div>
                <div className="card-body">
                  <HijackTableComponent />
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
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Status</th>
                        <th>Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Clock</td>
                        <td>On</td>
                        <td>8h</td>
                      </tr>
                    </tbody>
                  </table>
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
      </div>
      <Footer />
    </>
  );
};

export default OverviewPage;
