import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import passport from '../../lib/passport';
import { parseJwt, setAccessCookie } from '../../lib/helpers';
import getRandomString from '../../utils/token';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nextConnect()
  .use(auth)
  .post(
    passport.authenticate('local'),
    (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
      if (req.body.rememberMe && req.user) {
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
          sameSite: 'strict',
          secure: process.env.production === 'true',
        });
      }

      const token = setAccessCookie(req, res);
      res.json(parseJwt(token));
    }
  );

export default handler;
