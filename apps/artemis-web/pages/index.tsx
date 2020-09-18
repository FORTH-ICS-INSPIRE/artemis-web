import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import Router from "next/router";
import * as React from "react";

const Home: React.FunctionComponent<{}> = () => {
  const { data } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;

  if (data.email) {
    Router.push("/overview");
  } else {
    Router.push("/login");
  }

  return <div />;
};

export default Home;
