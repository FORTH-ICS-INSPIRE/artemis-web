import nc from 'next-connect';
import passport from '../../../../libs/passport';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../../definitions';
import auth from '../../../../middleware/auth';
import { extractLdapUser } from '../../../../utils/parsers';
import { csrf } from '../../../../libs/csrf';
import captcha from '../../../../middleware/captcha';
import limiter from '../../../../middleware/limiter';

const handler = nc()
  .use(limiter('ldap'))
  .use(captcha())
  .use(auth)
  .post(
    passport.authenticate('ldapauth'),
    (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
      res.json({ user: extractLdapUser(req) });
    }
  );

export default csrf(handler);
