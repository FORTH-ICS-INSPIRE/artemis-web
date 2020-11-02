import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import { setAccessCookie } from '../../lib/helpers';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nextConnect()
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    if (!req.user) res.send(null);
    else {
      setAccessCookie(req, res);
    }
  });

export default handler;
