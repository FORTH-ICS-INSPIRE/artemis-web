import React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Head from "next/head";

const Signup = () => {
  const { data } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email) {
    loggedIn = true;
    Router.push("/overview");
  }

  const Footer = dynamic(() => import("./components/Footer/Footer"));
  const SignUp = dynamic(() => import("./components/SignUp/SignUp"));
  const Header = dynamic(() => import("./components/Header/Header"));
  return (
    <>
      <Head>
        <title>ARTEMIS - Sign Up</title>
      </Head>
      <div id="page-container">
        <Header loggedIn={loggedIn} />
        <div id="content-wrap" style={{ paddingBottom: "5rem" }}>
          {!loggedIn && (
            <div className="container d-flex align-items-center flex-column">
              <SignUp />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
