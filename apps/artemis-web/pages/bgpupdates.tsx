import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import BGPTableComponent from '../components/bgptable/bgptable';
import { useUser } from '../lib/hooks';
import { useSubscription } from '@apollo/client';
import { BGP_SUB } from '../utils/graphql';

const BGPUpdates: React.FunctionComponent<{}> = () => {
  const [user, { loading }] = useUser();
  const router = useRouter();
  const BGP_DATA = useSubscription(BGP_SUB).data;
  
  useEffect(() => {
    // redirect to home if user is authenticated
    if (!user && !loading) router.push('/');
  }, [user, loading, router]);

  const Footer = dynamic(() => import('../components/footer/footer'));
  const Header = dynamic(() => import('../components/header/header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>
      <Header />
      {user && !loading && (
      <div
        className="container overview col-lg-12"
        style={{ paddingTop: '120px' }}
      >
        <div className="row">
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <h1 style={{ color: 'white' }}>BGP Updates</h1>{' '}
            <hr style={{ backgroundColor: 'white' }} />
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <div className="card">
              <div className="card-header"> </div>
              <div className="card-body">
                <BGPTableComponent
                  data={BGP_DATA ? BGP_DATA.view_hijacks : []} />
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
                    <option value="prefix">Prefix</option>
                    <option value="matched_prefix">Matched Prefix</option>
                    <option value="origin_as">Origin AS</option>
                    <option value="peer_asn">Peer AS</option>
                    <option value="service">Service</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
      <Footer />
    </>
  );
};

export default BGPUpdates;
