import nc from 'next-connect';
import auth from '../../../middleware/auth';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../definitions';
import { csrf } from '../../../libs/csrf';
import limiter from '../../../middleware/limiter';

const logout = (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
  req.logOut();
  res.clearCookie('remember_me');
  res.clearCookie('access_token');
  res.clearCookie('XSRF-TOKEN');
  res.clearCookie('sid');
  res.status(204).end();
};

const handler = nc().use(limiter).use(auth).delete(logout);

export default csrf(handler);
