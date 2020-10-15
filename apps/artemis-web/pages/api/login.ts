import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import passport from '../../lib/passport';
import { extractUser } from '../../lib/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import getRandomString from '../../utils/token';

import jwt from 'jsonwebtoken';

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

const handler = nextConnect();

handler.use(auth);

handler.post(
  passport.authenticate('local'),
  (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
    if (!req.body.rememberMe || !req.user) {
      res.json({ user: extractUser(req) });
    } else {
      const token = getRandomString(64);
      req.db.collection('users').updateOne(
        { email: req.body.email },
        {
          $set: {
            token: token,
          },
        }
      );
      res.cookie('remember_me', token, {
        path: '/',
        httpOnly: true,
        maxAge: 604800000,
      });

      res.json({ user: extractUser(req) });
    }

    if (req.user) {
      const token = {
        access_token: jwt.sign(
          {
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': ['user'],
              'x-hasura-default-role': 'user',
              'x-hasura-user-id': '11',
            },
            exp: 1602685854,
            sub: 'guest',
            fresh: false,
            type: 'access',
          },
          '44fe431cdc896ccab691ad0599f4e0a12690ce1ededebe57b825823bc6b4d24f'
        ),
      };
      res.cookie('token', token.access_token, {
        path: '/',
        httpOnly: true,
        maxAge: 604800000,
      });
    }

  }
);

export default handler;
