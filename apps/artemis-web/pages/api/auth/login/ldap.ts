import nc from 'next-connect';
import passport from '../../../../libs/passport';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../../definitions';
import auth from '../../../../middleware/auth';
import { extractLdapUser } from '../../../../utils/parsers';

const handler = nc()
  .use(auth)
  .post(
    passport.authenticate('ldapauth'),
    (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
      res.json({ user: extractLdapUser(req) });
    }
  );

export default handler;
