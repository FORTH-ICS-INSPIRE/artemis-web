import * as React from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Head from "next/head";
import { signIn, signOut, useSession } from 'next-auth/client';
import cookie from 'js-cookie';

const Login: React.FunctionComponent<{}> = () => {
  const [ session, loading ] = useSession();

  const { data } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data || loading) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email || session) {
    loggedIn = true;
    // Router.push("/overview");
  }
  const logout = () => {
    cookie.remove('token');
    //   revalidate();
    Router.push('/');
    // window.location.reload(false);
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
        <Header loggedIn={loggedIn} call={session? signOut: logout} />
        <div id="content-wrap" style={{ paddingBottom: "5rem" }}>
          {!loggedIn && !session && <SignIn2 call={signIn('github')} />}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
