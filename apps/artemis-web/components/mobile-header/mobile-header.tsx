import { Link, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import { slide as Burger } from 'react-burger-menu';

const MobileHeader = (props) => {
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
      body: JSON.stringify({ _csrf: props._csrf }),
    });

    document.location.href = '/login';
  };

  const styles = {
    bmBurgerButton: {
      // position: 'fixed',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '36px',
      marginLeft: '15px',
    },
    bmBurgerBars: {
      background: '#373a47',
    },
    bmBurgerBarsHover: {
      background: '#a90000',
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#bdc3c7',
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',

      // left: '-300px'
    },
    bmMenu: {
      background: '#373a47',
      fontSize: '1.15em',
      overflowY: 'hidden',
      padding: '2.5em 0em 0',
    },
    bmMorphShape: {
      fill: '#373a47',
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em',
    },
    bmItem: {
      display: 'inline-block',
      textDecoration: 'none',
      marginBottom: '10px',
      color: '#d1d1d1',
      transition: 'color 0.2s',
      '&:hover': {
        color: 'white',
      },
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <div id="outer-container" style={{ margin: '0px' }} className="container">
      <Burger
        outerContainerId={'outer-container'}
        noOverlay
        styles={styles}
        customBurgerIcon={<img alt="" width="50px" src="menu.svg" />}
        left
      >
        <ul style={{ listStyleType: 'none' }}>
          {user && user.role !== 'pending' && (
            <>
              <li className="menu-item">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="menu-item">
                <Link href="/bgpupdates">BGP Updates</Link>
              </li>
              <li className="menu-item">
                <Link href="/hijacks">Hijacks</Link>
              </li>
            </>
          )}
          {user && user.role === 'admin' && (
            <li className="menu-item">
              <div>
                <a href="#" onClick={handleClickAdmin}>
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
                    <Link href="/admin/system">System</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseAdmin}>
                    <Link href="/admin/user_management">User Management</Link>
                  </MenuItem>
                </Menu>
              </div>
            </li>
          )}
          {user && user.role !== 'pending' && (
            <li className="menu-item">
              <div>
                <a href="#" onClick={handleClickAction}>
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
                  <MenuItem onClick={handleCloseAction}>
                    <Link href="/config_comparison">Config Comparison</Link>
                  </MenuItem>
                </Menu>
              </div>
            </li>
          )}
          <li className="menu-item">
            <a target="_blank" rel="noreferrer" href="https://bgpartemis.org/">
              About
            </a>
          </li>
          {!user && (
            <>
              <li id="security.login" className="menu-item">
                <Link href="/login">Login</Link>
              </li>
              <li id="security.register_user" className="menu-item">
                <Link href="/signup">Create Account</Link>
              </li>
            </>
          )}
          {user && (
            <li className="menu-item">
              <a href="#" id="logout" onClick={handleLogout}>
                Logout
              </a>
            </li>
          )}
        </ul>
      </Burger>
    </div>
  );
};

export default MobileHeader;
