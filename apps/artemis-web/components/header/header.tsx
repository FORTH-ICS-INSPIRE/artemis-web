import { useUser } from '../../lib/hooks';
import Link from 'next/link';
import React from 'react';
import { Router } from 'next/router';
import { useRouter } from 'next/router';

const Header = (props) => {
  const router = useRouter();

  const user = props.user;

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'DELETE',
    });
    // set the user state to null
    router.push('/');
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
      style={{ marginBottom: '20px' }}
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="./artemis-logo.png" alt="" width="128px;" />
        </a>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="nav navbar-nav navbar-right">
            {user && (
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
            {!user && (
              <>
                <li id="security.login" className="nav-item">
                  <Link href="/signin">
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
            {user && (
              <li className="nav-item">
                <a id="logout" className="nav-link" onClick={handleLogout}>
                  Sign out
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
