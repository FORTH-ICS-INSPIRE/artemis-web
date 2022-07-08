import { createRouter } from "next-connect";
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
import memory from '../../../../utils/captchaMemoryStore';

const router = createRouter();

const handler = router
  .use(limiter('ldap'))
  .use(captcha('login'))
  .use(auth)
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
    memory.incr(req.ip);
    next();
  })
  .post(
    passport.authenticate('ldapauth'),
    (req: any, res: NextApiResponseExtended, next) => {
      memory.reset(req.ip);
      res.json({ user: extractLdapUser(req) });
    }
  );

export default csrf(handler);
