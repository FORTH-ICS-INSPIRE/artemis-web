import nc from 'next-connect';
import passport from '../../lib/passport';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';

const handler = nc()
  .use(auth)
  .post(
    passport.authenticate('ldapauth', { session: false }),
    (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
      res.send({ status: "ok" })
    }
  );

export default handler;
