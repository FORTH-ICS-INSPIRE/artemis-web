import { Menu, MenuItem } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useFetch } from '../../hooks/useJWT';
import { parseJwt } from '../../lib/helpers';

const Header = (props) => {
  const { data } = useFetch('/api/jwt');
  const jwt = data ? parseJwt(data) : null;
  const user = jwt ? jwt.user : null;

  const [anchorAdmin, setAnchorAdmin] = React.useState(null);
  const [anchorAction, setAnchorAction] = React.useState(null);

  const handleClickAdmin = (event) => {
    setAnchorAdmin(event.currentTarget);
  };

  const handleClickAction = (event) => {
    setAnchorAction(event.currentTarget);
  };

  const handleCloseAdmin = () => {
    setAnchorAdmin(null);
  };

  const handleCloseAction = () => {
    setAnchorAction(null);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'DELETE',
    });

    window.location.reload();
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
            {user && user.role !== 'pending' && (
              <>
                <li className="nav-item">
                  <Link href="/dashboard">
                    <a href="/dashboard" className="nav-link">
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/bgpupdates">
                    <a href="/bgpupdates" className="nav-link">
                      BGP Updates
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/hijacks">
                    <a href="/hijacks" className="nav-link">
                      Hijacks
                    </a>
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav mr-auto" />
          <ul className="nav navbar-nav navbar-right">
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <div>
                  <a href="#" className="nav-link" onClick={handleClickAdmin}>
                    Admin
                  </a>

                  <Menu
                    id="simple-menu"
                    anchorEl={anchorAdmin}
                    keepMounted
                    open={Boolean(anchorAdmin)}
                    onClose={handleCloseAdmin}
                    style={{ top: '36px' }}
                  >
                    <MenuItem onClick={handleCloseAdmin}>
                      <Link href="/system">System</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseAdmin}>
                      <Link href="/user_management">User Management</Link>
                    </MenuItem>
                  </Menu>
                </div>
              </li>
            )}
            {user && user.role !== 'pending' && (
              <li className="nav-item">
                <div>
                  <a href="#" className="nav-link" onClick={handleClickAction}>
                    Actions
                  </a>

                  <Menu
                    id="simple-menu"
                    anchorEl={anchorAction}
                    keepMounted
                    open={Boolean(anchorAction)}
                    onClose={handleCloseAction}
                    style={{ top: '36px' }}
                  >
                    <MenuItem onClick={handleCloseAction}>
                      <Link href="/password_change">Password Change</Link>
                    </MenuItem>
                  </Menu>
                </div>
              </li>
            )}
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
