import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HijackTableComponent from '../components/hijack-table/hijack-table';
import withAuth, { getProps } from '../HOC/withAuth';

const HijacksPage = (props) => {
  const user = props.user;
  const router = useRouter();

  useEffect(() => {
    // redirect to home if user is authenticated
    // TODO: change that to 'user'
    if (!user || user.role !== 'pending') router.push('/signin');
  }, [user, router]);

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>
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
                  <HijackTableComponent />
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

export async function getServerSideProps(ctx) {
  return getProps(ctx);
}

export default withAuth(HijacksPage);
