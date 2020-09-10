import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import dynamic from 'next/dynamic';
import useSWR from 'swr';


const Signup = () => {
  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

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
  }

  const Footer = dynamic(() => import('./components/Footer/Footer'));
  const SignUp = dynamic(() => import('./components/SignUp/SignUp'));
  const Header = dynamic(() => import('./components/Header/Header'));
  return (
    <>
    <Header loggedIn={loggedIn}></Header>
    { !loggedIn &&
    <div className="container d-flex align-items-center flex-column">
      <SignUp />
    </div>
    }
    <Footer></Footer>
    </>
  );
};

export default Signup;
