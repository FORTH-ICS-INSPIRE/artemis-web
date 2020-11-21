import nc from 'next-connect';
import auth from '../../middleware/auth';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nc()
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    req.logOut();
    res.clearCookie('remember_me');
    res.clearCookie('access_token');
    res.status(204).end();
  })
  .delete((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    req.logOut();
    res.clearCookie('remember_me');
    res.clearCookie('access_token');
    res.writeHead(204, { Location: '/signin' });
    res.end();
  });

export default handler;
