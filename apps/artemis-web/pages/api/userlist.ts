import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';

const handler = nc()
  .use(auth)
  .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    if (!req.user || req.user.role !== 'admin') {
      res.status(401);
      res.json('You do not have permission to access this api!');
    } else {
      const users = await req.db
        .collection('users')
        .find({}, { projection: {} })
        .toArray();

      res.status(200);
      res.json(users);
    }
  });

export default handler;
