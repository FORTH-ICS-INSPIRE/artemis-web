import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import HijackTable from './components/HijackTable/HijackTable';

function Overview() {
  const { data, revalidate } = useSWR('/api/me', async function (args) {
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
  const Footer = dynamic(() => import('./components/Footer/Footer'));
  const Header = dynamic(() => import('./components/Header/Header'));

  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>
      <Header loggedIn={loggedIn}></Header>
      <main role="main" className="container-fluidc">
        <div className="row">
        <div className="col-lg-2" />
        <div className="col-lg-8">
          <h1>Dashboard</h1> <hr />
          </div>
          </div>
        <div className="row">
        <div className="col-lg-2"/>
          <div className="col-lg-6">
              
              <div className="card">
                <div className="card-header">Activity</div>
                <div className="card-body">Welcome back guest@guest.com, your last login was at (11-09-2020 05:22:16) from 172.26.0.11. </div>
              </div>
          </div>
        </div>
        <div className="row" style={ {marginTop: "20px"} }>
        <div className="col-lg-2"/>
          <div className="col-lg-6">
              <div className="card">
                <div className="card-header">Ongoing, Non-Dormant Hijacks </div>
                <div className="card-body">
                <span class="caret"></span>
                  <HijackTable></HijackTable>
                </div>
              </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}

export default Overview;
