import React from 'react';
import { useMedia } from 'react-media';
import { useJWT } from '../../utils/hooks/use-jwt';
import DesktopHeader from '../desktop-header/desktop-header';
import MobileHeader from '../mobile-header/mobile-header';

const Header = (props) => {
  const [user, _] = useJWT();

  const GLOBAL_MEDIA_QUERIES = {
    pc: '(min-width: 700px)',
    mobile: '(max-width: 700px)',
  };
  const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
      style={{
        marginBottom: '20px',
        padding: matches.mobile ? '.5rem 0rem' : '.5rem 1rem',
      }}
    >
      {matches.mobile ? (
        <MobileHeader user={user} {...props} />
      ) : (
        <DesktopHeader user={user} {...props} />
      )}
    </nav>
  );
};

export default Header;
