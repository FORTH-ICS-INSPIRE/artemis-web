import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import argon2 from 'argon2';
import auth from '../../middleware/auth';
import { nanoid } from 'nanoid';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';

const handler = nc()
  .use(auth)
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
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
    res.json({});
  });

export default handler;
