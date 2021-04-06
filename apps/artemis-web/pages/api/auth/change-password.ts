import { csrf } from '../../../libs/csrf';
import argon2 from 'argon2';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../definitions';
import auth from '../../../middleware/auth';

const handler = nc()
  .use(auth)
  .put(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { old_password, new_password } = req.body;
      if (!req.user) throw new Error('You need to be logged in.');

      if (!(await argon2.verify(req.user.password, old_password)))
        throw new Error('Old password is wrong.');

      const password = await argon2.hash(new_password);

      await req.db
        .collection('users')
        .updateOne({ _id: req.user._id }, { $set: { password } });
      res.status(200);
      res.json({ message: 'Your password has been updated.' });
    } catch (error) {
      res.status(300);
      res.json({
        ok: false,
        message: error.toString(),
      });
    }
  });

export default csrf(handler);
