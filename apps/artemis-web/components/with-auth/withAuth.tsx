import React from 'react';
import { useCookie } from 'next-cookie';
import jwt from 'jsonwebtoken';

const withAuth = (WrappedComponent, ACL) => {
  class App extends React.PureComponent {
    render() {
      return <WrappedComponent {...this.props} />;
    }

    static async getInitialProps(ctx) {
      const { req, res } = ctx;

      if (req) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const cookies = useCookie(ctx);
        const accessToken: string = cookies.get('access_token');
        let claims: any;

        try {
          const verifiedClaims = jwt.verify(
            accessToken,
            process.env.JWT_SECRET
          );

          if (typeof verifiedClaims === 'string') {
            claims = JSON.parse(verifiedClaims);
          } else {
            claims = verifiedClaims;
          }
        } catch (e) {
          claims = null;
        }

        const props = {
          user: claims ? claims.user : null,
        };

        const isLoggedIn = !!claims;

        if (
          !isLoggedIn &&
          WrappedComponent.name !== 'SignupPage' &&
          WrappedComponent.name !== 'SigninPage'
        ) {
          res.redirect('/signin');
        } else if (
          isLoggedIn &&
          (WrappedComponent.name === 'SignupPage' ||
            WrappedComponent.name === 'SigninPage')
        ) {
          res.redirect('/overview');
        } else if (isLoggedIn && !ACL.includes(claims.user.role)) {
          res.redirect('/');
        } else if (
          isLoggedIn &&
          WrappedComponent.name === 'HomePage' &&
          claims.user.role == 'pending'
        ) {
          res.redirect('pending');
        } else if (
          isLoggedIn &&
          WrappedComponent.name === 'HomePage' &&
          claims.user.role == 'user'
        ) {
          res.redirect('overview');
        }

        return props;
      } else return {};
    }
  }

  return App;
};

export default withAuth;
