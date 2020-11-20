import Head from 'next/head';
import React from 'react';
import NotFoundHOC from '../components/404-hoc/404-hoc';

const PendingPage = () => {
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
                    <img src="./pending_approval.png"></img>
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

export default NotFoundHOC(PendingPage, ['pending']);
