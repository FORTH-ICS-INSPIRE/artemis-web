import React from 'react';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import HijackTable from '../components/hijack-table/hijack-table';

const Hijacks: React.FunctionComponent<{}> = () => {
  const { data } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email) {
    loggedIn = true;
  } else {
    Router.push('/login');
  }
  const Footer = dynamic(() => import('../components/footer/footer'));
  const Header = dynamic(() => import('../components/header/header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>
      <Header loggedIn={loggedIn} />
      <div
        className="container overview col-lg-12"
        style={{ paddingTop: '120px' }}
      >
        <div className="row">
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <h1 style={{ color: 'white' }}>Hijacks</h1>{' '}
            <hr style={{ backgroundColor: 'white' }} />
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <div className="card">
              <div className="card-header"> </div>
              <div className="card-body">
                <HijackTable />
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <div className="card">
              <div className="card-header"> View distinct values </div>
              <div className="card-body">
                <div className="col-lg-3">
                  <select
                    className="form-control"
                    id="distinct_values_selection"
                  >
                    <option value="select">Select</option>
                    <option value="prefix">Hijacked Prefix</option>
                    <option value="configured_prefix">Matched Prefix</option>
                    <option value="hijack_as">Hijack AS</option>
                    <option value="rpki_status">RPKI</option>
                  </select>
                </div>
                {/* <table className="table table-hover">
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
                </table> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hijacks;
