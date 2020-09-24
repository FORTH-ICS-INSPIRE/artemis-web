import * as React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import HijackTable from '../components/ongoing-hijack-table/ongoing-hijack-table';
import { signOut, useSession } from 'next-auth/client';
import { csrfToken } from 'next-auth/client';

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const graphQLConnect = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:9999',
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': '@rt3m1s.',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
};

const client = graphQLConnect();

const Overview = ({ csrfToken }) => {
  const [session, loading] = useSession();

  if (loading) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (session) {
    loggedIn = true;
  }

  const Footer = dynamic(() => import('../components/footer/footer'));
  const Header = dynamic(() => import('../components/header/header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>

      <div id="page-container" style={{ paddingTop: '120px' }}>
        <Header loggedIn={loggedIn} call={signOut} />
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
                  Welcome back <b>{session.user && session.user.username}</b>,
                  your last login was at (
                  {session.user && session.user.lastLogin}).{' '}
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
                  <HijackTable />
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
        <Footer />
      </div>
    </>
  );
};

Overview.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context),
  };
};

export default Overview;
