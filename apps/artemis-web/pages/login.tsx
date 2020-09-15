import * as React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Head from "next/head";

const Login = () => {
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

  const Footer = dynamic(() => import("../components/footer/footer"));
  const SignIn2 = dynamic(() => import("../components/sign-in/sign-in"));
  const Header = dynamic(() => import("../components/header/header"));

  return (
    <>
      <Head>
        <title>ARTEMIS - Login</title>
      </Head>
      <div id="login-container">
        <Header loggedIn={loggedIn} />
        <div id="content-wrap" style={{ paddingBottom: "5rem" }}>
          {!loggedIn && <SignIn2 />}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
