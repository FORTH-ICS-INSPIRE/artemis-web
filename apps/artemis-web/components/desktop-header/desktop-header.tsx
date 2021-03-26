import { Link, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';

const DesktopHeader = (props) => {
  const user = props.user;
  const [anchorAdmin, setAnchorAdmin] = useState(null);
  const [anchorAction, setAnchorAction] = useState(null);

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
    await fetch('/api/auth/logout', {
      method: 'DELETE',
    });

    document.location.href = '/login';
  };

  return (
    <div className="container">
      <a className="navbar-brand" href="/">
        <img src="/artemis-logo.png" alt="" width="128px;" />
      </a>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="nav navbar-nav navbar-right">
          {user && user.role !== 'pending' && (
            <>
              <li className={window.location.pathname === '/dashboard' ? "nav-item visited" : "nav-item"}>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className={window.location.pathname === '/bgpupdates' ? "nav-item visited" : "nav-item"}>
                <Link href="/bgpupdates" className="nav-link">
                  BGP Updates
                </Link>
              </li>
              <li className={window.location.pathname === '/hijacks' ? "nav-item visited" : "nav-item"}>
                <Link href="/hijacks" className="nav-link">
                  Hijacks
                </Link>
              </li>
            </>
          )}
        </ul>
        <ul className="navbar-nav mr-auto" />
        <ul className="nav navbar-nav navbar-right">
          {user && user.role === 'admin' && (
            <li className={window.location.pathname.includes('/admin') ? "nav-item visited" : "nav-item"}>
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
                  style={{ top: '14px' }}
                >
                  <Link href="/admin/system">
                    <MenuItem onClick={handleCloseAdmin}>System</MenuItem>
                  </Link>
                  <Link href="/admin/user_management">
                    <MenuItem onClick={handleCloseAdmin}>
                      User Management
                    </MenuItem>
                  </Link>
                </Menu>
              </div>
            </li>
          )}
          {user && user.role !== 'pending' && (
            <li className={window.location.pathname.includes('config_comparison') || window.location.pathname.includes('password_change') ? "nav-item visited" : "nav-item"}>
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
                  style={{ top: '14px' }}
                >
                  <Link href="/password_change">
                    <MenuItem onClick={handleCloseAction}>
                      Password Change
                    </MenuItem>
                  </Link>
                  <Link href="/config_comparison">
                    <MenuItem onClick={handleCloseAction}>
                      Config Comparison
                    </MenuItem>
                  </Link>
                </Menu>
              </div>
            </li>
          )}
          <li className="nav-item">
            <a
              className="nav-link"
              target="_blank"
              rel="noreferrer"
              href="https://bgpartemis.org/"
            >
              About
            </a>
          </li>
          {!user && (
            <>
              <li id="security.login" className={window.location.pathname === '/login' ? "nav-item visited" : "nav-item"}>
                <Link className="nav-link" href="/login">
                  Login
                </Link>
              </li>
              <li id="security.register_user" className={window.location.pathname === '/signup' ? "nav-item visited" : "nav-item"}>
                <Link className="nav-link" href="/signup">
                  Create Account
                </Link>
              </li>
            </>
          )}
          {user && (
            <li className="nav-item">
              <a id="logout" className="nav-link" onClick={handleLogout}>
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DesktopHeader;
