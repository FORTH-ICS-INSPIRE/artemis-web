import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Router from 'next/router';
import dynamic from 'next/dynamic';


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
      <Header loggedIn={loggedIn}></Header>
      <div className="container d-flex align-items-center flex-column">
        yolo
      </div>
      <Footer></Footer>
      </>
      // <form onSubmit={handleSubmit}>
      //   <p>Login</p>
      //   <input
      //     name="email"
      //     type="email"
      //     value={email}
      //     onChange={(e) => setEmail(e.target.value)}
      //   />
      //   <input
      //     name="password"
      //     type="password"
      //     value={password}
      //     onChange={(e) => setPassword(e.target.value)}
      //   />
      //   <input type="submit" value="Submit" />
      //   {loginError && <p style={{color: 'red'}}>{loginError}</p>}
      // </form>
    );
}

export default Overview;
