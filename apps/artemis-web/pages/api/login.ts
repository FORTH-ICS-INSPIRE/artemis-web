import nc from 'next-connect';
import auth from '../../middleware/auth';
import passport from '../../lib/passport';
import { extractUser } from '../../lib/helpers';
import getRandomString from '../../utils/token';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nc()
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
          secure: process.env.NODE_ENV === 'production',
        });
      }

      const userObj = extractUser(req);
      res.json({ user: userObj });
    }
  );

export default handler;
