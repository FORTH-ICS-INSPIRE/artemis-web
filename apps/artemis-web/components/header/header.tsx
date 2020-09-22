import React from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/client';
// const [session, loading] = useSession();

type MyProps = {
  loggedIn: boolean;
  call: (event: any) => void;
};

class Header extends React.Component<MyProps> {
  render() {
    const { loggedIn, call } = this.props;

    return (
      <>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <nav
          className="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
          style={{ marginBottom: '20px' }}
        >
          <div className="container">
            <a className="navbar-brand" href="/">
              <img src="./artemis-logo.png" alt="" width="128px;" />
            </a>
            {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="nav navbar-nav navbar-right">
                {loggedIn && (
                  <>
                    <li className="nav-item">
                      <Link href="/overview">
                        <a href="/#" className="nav-link">
                          Overview
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/bgpupdates">
                        <a href="/#" className="nav-link">
                          BGP Updates
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/hijacks">
                        <a href="/#" className="nav-link">
                          Hijacks
                        </a>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav mr-auto" />
              <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.inspire.edu.gr/artemis/"
                  >
                    About
                  </a>
                </li>
                {!loggedIn && (
                  <>
                    <li id="security.login" className="nav-item">
                      <Link href="/login">
                        <a href="/#" className="nav-link">
                          Login
                        </a>
                      </Link>
                    </li>
                    <li id="security.register_user" className="nav-item">
                      <Link href="/signup">
                        <a href="/#" className="nav-link">
                          Create Account
                        </a>
                      </Link>
                    </li>
                  </>
                )}
                {loggedIn && (
                  <li className="nav-item">
                    <a
                      href={`/api/auth/signout`}
                      className='nav-link'
                      onClick={(e) => {
                        e.preventDefault();
                        signOut();
                      }}
                    >
                      Sign out
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Header;
