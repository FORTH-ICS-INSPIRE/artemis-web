import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { csrf } from '../../libs/csrf';
import limiter from '../../middleware/limiter';

const handler = nc()
  .use(limiter('userlist'))
  .use(auth)
  .use(authorization(['admin']))
  .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const users = await req.db
      .collection('users')
      .find({}, { projection: {} })
      .toArray();

    res.status(200);
    res.json(users);
  });

export default handler;
