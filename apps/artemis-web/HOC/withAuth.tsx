import { NextApiRequest, NextApiResponse } from 'next';
import { extractUser } from '../lib/helpers';
import passport from '../lib/passport';
import auth from '../middleware/auth';
import { initializeApollo } from '../utils/graphql';
import nc from 'next-connect';
import React from 'react';

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

      interface NextApiRequestExtended extends NextApiRequest {
        db: any;
        user: any;
      }

      interface NextApiResponseExtended extends NextApiResponse {
        cookie(
          arg0: string,
          token: string,
          arg2: { path: string; httpOnly: boolean; maxAge: number }
        );
      }

      const handler = nc<NextApiRequestExtended, NextApiResponseExtended>()
        .use(auth)
        .post(passport.authenticate('local'), (req, res, next) => {
          if (!req.body.rememberMe || !req.user) {
            res.json({ user: extractUser(req.user) });
          }
        });

      try {
        await handler.apply(ctx.req, ctx.res);
      } catch (e) {
        console.log(e);
      }

      return {};
    }

    render() {
      return (
        <>
          <WrappedComponent {...this.props} />
        </>
      );
    }
  }

  return App;
};

export default withAuth;
