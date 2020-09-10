import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import dynamic from 'next/dynamic';

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   //call api
  //   fetch('/api/auth', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email,
  //       password,
  //     }),
  //   })
  //     .then((r) => {
  //       return r.json();
  //     })
  //     .then((data) => {
  //       if (data && data.error) {
  //         setLoginError(data.message);
  //       }
  //       if (data && data.token) {
  //         //set cookie
  //         cookie.set('token', data.token, {expires: 2});
  //         Router.push('/');
  //       }
  //     });
  // }
  const Footer = dynamic(() => import('./components/Footer/Footer'));
  const SignIn2 = dynamic(() => import('./components/SignIn/SignIn'));
  const Header = dynamic(() => import('./components/Header/Header'));

  return (
    <>
    <Header></Header>
    <div className="container d-flex align-items-center flex-column">
      <SignIn2 />
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
};

export default Login;
