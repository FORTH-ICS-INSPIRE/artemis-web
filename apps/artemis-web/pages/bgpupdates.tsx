import Head from 'next/head';
import React from 'react';
import BGPTableComponent from '../components/bgp-table/bgp-table';
import { useGraphQl } from '../hooks/useGraphQL';
import { useJWT } from '../hooks/useJWT';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const BGPUpdates = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }

  const [user] = useJWT();
  const BGP_DATA = useGraphQl('bgpupdates', props.isProduction);

  return (
    <NotFoundHOC user={user} ACL={['admin', 'user']}>
      <Head>
        <title>ARTEMIS - BGP Updates</title>
      </Head>
      {user && (
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
                    data={BGP_DATA ? BGP_DATA.view_bgpupdates : []}
                  />
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
    </NotFoundHOC>
  );
};

export default BGPUpdates;
