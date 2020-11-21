import nc from 'next-connect';
import passport from '../../lib/passport';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { extractLdapUser } from '../../lib/helpers';

const handler = nc()
  .use(auth)
  .post(
    passport.authenticate('ldapauth', { session: false }),
    (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
      res.json({ user: extractLdapUser(req) });
    }
  );

export default handler;
