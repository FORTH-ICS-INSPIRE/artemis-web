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
    arg2: {
      path: string;
      httpOnly: boolean;
      maxAge: number;
      sameSite: string;
      secure: boolean;
    }
  );
}

const handler = nextConnect();

handler.use(auth);

handler.post(
  passport.authenticate('local'),
  (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
    const userObj = extractUser(req);

    if (!req.body.rememberMe || !req.user) {
      res.json({ user: userObj });
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

      res.json({ user: userObj });
    }

    res.cookie(
      'access_token',
      jwt.sign(
        {
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': [userObj.role],
            'x-hasura-default-role': userObj.role,
            'x-hasura-user-id': '11',
          },
          user: userObj,
        },
        process.env.JWT_SECRET
      ),
      {
        path: '/',
        httpOnly: true,
        maxAge: 604800000, // todo set small timeout and have refresh token impl
        sameSite: 'strict',
        secure: process.env.production === 'true',
      }
    );
  }
);

export default handler;
