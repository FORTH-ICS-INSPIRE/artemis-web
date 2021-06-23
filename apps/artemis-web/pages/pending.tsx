import Head from 'next/head';
import React, { useEffect } from 'react';
import AuthHOC from '../components/401-hoc/401-hoc';
import { setup } from '../libs/csrf';
import { autoLogout } from '../utils/token';

const PendingPage = (props) => {
  useEffect(() => {
    autoLogout(props);
  }, []);

  return (
    <>
      <Head>
        <title>ARTEMIS - Pending Administrator Approval</title>
      </Head>
      <div id="pending-container">
        <div id="content-wrap" style={{ paddingBottom: '5rem' }}>
          <div className="row" style={{ marginTop: '160px' }}>
            <div className="col-lg-4" />
            <div className="col-lg-4">
              <div className="jumbotron">
                <div className="row">
                  <div className="col-lg-3" />
                  <div className="col-lg-7">
                    <img alt="" src="./pending_approval.png"></img>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '20px' }}>
                  <div className="col-lg-3" />
                  <div className="col-lg-8">
                    <h1>Pending Approval</h1>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '20px' }}>
                  <div className="col-lg-12">
                    <h3>
                      Your registration is pending approval from an
                      administrator.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthHOC(PendingPage, ['pending']);

export const getServerSideProps = setup(async (req, res, csrftoken) => {
  return { props: { _csrf: csrftoken } };
});
