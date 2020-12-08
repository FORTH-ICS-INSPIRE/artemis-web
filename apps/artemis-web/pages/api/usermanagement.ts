import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';

const handler = nc()
  .use(auth)
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    if (!req.user || req.user.role !== 'admin') {
      res.status(401);
      res.json({
        code: 401,
        message: 'Login Required',
      });
    } else {
      const { userName, action } = req.body;

      switch (action) {
        case 'approval':
          await req.db.collection('users').updateOne(
            { name: userName },
            {
              $set: {
                role: 'user',
              },
            }
          );
          break;
        case 'promote':
          await req.db.collection('users').updateOne(
            { name: userName },
            {
              $set: {
                role: 'admin',
              },
            }
          );
          break;
        case 'demote':
          await req.db.collection('users').updateOne(
            { name: userName },
            {
              $set: {
                role: 'user',
              },
            }
          );
          break;
        case 'delete':
          req.db.collection('users').deleteOne({ name: userName });
          break;
      }

      res.status(200);
      res.json({
        code: 200,
        message: 'Requested action was successful',
      });
    }
  });

export default handler;
