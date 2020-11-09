import Head from 'next/head';
import React, { useEffect } from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';
import HijackTableComponent from '../components/hijack-table/hijack-table';
import { useGraphQl } from '../hooks/useGraphQL';
import { useJWT } from '../hooks/useJWT';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HijacksPage = (props) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('../mocks/browser');
      worker.start();
    }
  }
  const user = props.user;

  const HIJACK_DATA = useGraphQl('hijack', props.isProduction);
  const notify = (message) => toast(message);

  useEffect(() => {
    if (HIJACK_DATA && HIJACK_DATA.view_hijacks)
      notify(`${HIJACK_DATA.view_hijacks.length} hijacks found!`);
  });

  return (
    <>
      <Head>
        <title>ARTEMIS - Hijacks</title>
      </Head>
      <ToastContainer />
      {user && (
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
                  <HijackTableComponent
                    data={HIJACK_DATA ? HIJACK_DATA.view_hijacks : []}
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
                      <option value="prefix">Hijacked Prefix</option>
                      <option value="configured_prefix">Matched Prefix</option>
                      <option value="hijack_as">Hijack AS</option>
                      <option value="rpki_status">RPKI</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotFoundHOC(HijacksPage, ['admin', 'user']);
