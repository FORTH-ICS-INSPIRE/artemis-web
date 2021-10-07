import { GLOBAL_MEDIA_QUERIES } from '../../utils/token';
import React from 'react';
import Media from 'react-media';
import { useJWT } from '../../utils/hooks/use-jwt';
import DesktopHeader from '../desktop-header/desktop-header';
import MobileHeader from '../mobile-header/mobile-header';

const Header = (props) => {
  const [user, _] = useJWT();

  return (
    <Media queries={GLOBAL_MEDIA_QUERIES}>
      {matches => (
        <nav
          className="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
          style={{
            marginBottom: '20px',
            padding: matches.mobile ? '.5rem 0rem' : '.5rem 1rem',
          }}
        >

          {
            matches.mobile ? (
              <MobileHeader user={user} {...props} />
            ) : (
              <DesktopHeader user={user} {...props} />
            )
          }
        </nav>
      )}
    </Media>
  );
};

export default Header;
