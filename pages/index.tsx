import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Router from 'next/router';


function Home() {
  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;

  if (data.email) {
    loggedIn = true;
    Router.push('/overview');
  } else {
    Router.push('/login');
  }

  return (
    <div>

    </div>
  );
}

export default Home;
