import * as React from "react";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import Router from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import HijackTable from "../components/ongoing-hijack-table/ongoing-hijack-table";
import { signIn, signOut, useSession } from 'next-auth/client';
import cookie from 'js-cookie';

const Overview: React.FunctionComponent<{}> = () => {
  const [ session, loading ] = useSession();
  const { data } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data || loading) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email || session) {
    loggedIn = true;
  } else {
    Router.push("/login");
  }
  const Footer = dynamic(() => import("../components/footer/footer"));
  const Header = dynamic(() => import("../components/header/header"));
  const loginTime = (new Date(data.lastLogin)).toLocaleString('en-US', { timeZone: 'Europe/Athens'});
  const logout = () => {
    cookie.remove('token');
    //   revalidate();
    Router.push('/');
    // window.location.reload(false);
  }
  return (
    <>
      <Head>
        <title>ARTEMIS - Overview</title>
      </Head>

      <div id="page-container" style={{ paddingTop: "120px" }}>
        <Header loggedIn={loggedIn || session} call={session? signOut: logout} />
        <div id="content-wrap" style={{ paddingBottom: "5rem" }}>
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <h1 style={{ color: "white" }}>Dashboard</h1>
              {" "}
              <hr style={{ backgroundColor: "white" }} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header">Activity</div>
                <div className="card-body">
                  Welcome back <b>{data.username}</b>, your last login was at ({ loginTime }).
                  {" "}
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: "20px" }}>
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
          <div className="row" style={{ marginTop: "20px" }}>
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

export default Overview;
