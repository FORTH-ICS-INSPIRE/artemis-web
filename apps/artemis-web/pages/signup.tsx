import React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Head from "next/head";
import { csrfToken, getSession } from 'next-auth/client'
import { signIn, signOut, useSession } from 'next-auth/client';

const Signup = ({ csrfToken }) => {
  const [ session, loading ] = useSession();
  let loggedIn = false;

  if (loading) return <h1>Loading...</h1>;
  // let loggedIn = false;
  if (session) {
    loggedIn = true;
    Router.push("/overview");
  }

  const Footer = dynamic(() => import("../components/footer/footer"));
  const SignUp = dynamic(() => import("../components/sign-up/sign-up"));
  const Header = dynamic(() => import("../components/header/header"));
  return (
    <>
      <Head>
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        <Header loggedIn={false} call={signOut} />
        <div id="content-wrap" style={{ paddingBottom: "5rem" }}>
          {!loggedIn && (
            <div className="container d-flex align-items-center flex-column">
              <SignUp csrf={csrfToken} loggedIn={loggedIn} />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

Signup.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context)
  }
}

export default Signup;
