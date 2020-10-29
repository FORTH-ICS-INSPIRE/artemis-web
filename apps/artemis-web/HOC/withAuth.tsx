import { NextApiRequest, NextApiResponse } from 'next';
import { extractUser } from '../lib/helpers';
import passport from '../lib/passport';
import auth from '../middleware/auth';
import { initializeApollo } from '../utils/graphql';
import nc from 'next-connect';
import React from 'react';
import { useCookie } from 'next-cookie';
import jwt from 'jsonwebtoken';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    return <WrappedComponent {...props} />;
  };

  class App extends React.PureComponent {
    static async getInitialProps(ctx) {
      const apolloClient = initializeApollo(
        null,
        process.env.GRAPHQL_URI,
        process.env.GRAPHQL_WS_URI
      );
      /* eslint-disable-next-line react-hooks/rules-of-hooks */
      const cookies = useCookie(ctx);
      const accessToken: string = cookies.get('access_token');

      let claims: {
        'https://hasura.io/jwt/claims': object;
        user: object;
        iat: number;
      };
      try {
        const verifiedClaims = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (typeof verifiedClaims === 'string') {
          claims = JSON.parse(verifiedClaims);
        }
      } catch (e) {
        claims = null;
      }
      return {
        props: {
          user: claims ? claims.user : {},
          GRAPHQL_WS_URI: process.env.GRAPHQL_WS_URI,
          GRAPHQL_URI: process.env.GRAPHQL_URI,
          initialApolloState: apolloClient.cache.extract(),
        },
      };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return App;
};

export default withAuth;
