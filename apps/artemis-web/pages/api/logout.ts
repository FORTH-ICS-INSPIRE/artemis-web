import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nextConnect()
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    req.logOut();
    res.clearCookie('remember_me');
    res.clearCookie('access_token');
    res.status(204).end();
  })
  .delete((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    res.clearCookie('remember_me');
    res.clearCookie('access_token');
    req.logOut();
    res.status(204).end();
  });

export default handler;
