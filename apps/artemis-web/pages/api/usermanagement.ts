import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { csrf } from '../../libs/csrf';

const handler = nc()
  .use(auth)
  .use(authorization(['admin']))
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const { userName, action, new_password, email } = req.body;
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
      case 'changePass':
        await req.db.collection('users').updateOne(
          { name: userName },
          {
            $set: {
              password: await argon2.hash(new_password),
            },
          }
        );
        break;
      case 'create':
        await req.db
          .collection('users')
          .insertOne({
            _id: nanoid(12),
            email,
            password: await argon2.hash(new_password),
            name: userName,
            lastLogin: new Date(),
            currentLogin: new Date(),
            role: 'user',
            token: '',
          })
          .then(({ ops }) => ops[0]);
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
  });

export default csrf(handler);
