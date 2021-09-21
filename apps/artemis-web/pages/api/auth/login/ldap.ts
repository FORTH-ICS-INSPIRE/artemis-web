import nc from 'next-connect';
import passport from '../../../../libs/passport';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../../definitions';
import auth from '../../../../middleware/auth';
import { extractLdapUser } from '../../../../utils/parsers';
import { csrf } from '../../../../libs/csrf';
const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET

const handler = nc()
  .use(auth)
  .post(
    passport.authenticate('ldapauth'),
    (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
      const captchaResult = lambdaCaptcha.verify(req.body.encryptedExpr, req.body.captcha, SECRET);

      if (captchaResult === 'invalid_solution') {
        res.status(400).send('Captcha solution is incorrect.');
        return;
      }
      res.json({ user: extractLdapUser(req) });
    }
  );

export default csrf(handler);
