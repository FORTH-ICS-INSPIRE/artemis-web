import nc from 'next-connect';
import auth from '../../../../middleware/auth';
import passport from '../../../../libs/passport';
import { extractUser } from '../../../../utils/parsers';
import { getRandomString } from '../../../../utils/token';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../../definitions';
import { csrf } from '../../../../libs/csrf';
import captcha from '../../../../middleware/captcha';
import limiter from '../../../../middleware/limiter';
import memory from '../../../../utils/captchaMemoryStore';

const handler = nc()
  .use(limiter('credentials'))
  .use(captcha('login'))
  .use(auth)
  .post(
    passport.authenticate('local'),
    (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
      if (req.body.rememberMe && req.user) {
        memory.reset(req.ip);
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

export default csrf(handler);
