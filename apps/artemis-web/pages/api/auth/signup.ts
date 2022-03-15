import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import argon2 from 'argon2';
import auth from '../../../middleware/auth';
import { nanoid } from 'nanoid';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../definitions';
import { csrf } from '../../../libs/csrf';
import captcha from '../../../middleware/captcha';
import limiter from '../../../middleware/limiter';

const handler = nc()
  .use(limiter('signup'))
  .use(captcha('signup'))
  .use(auth)
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/g;

    if (!isEmail(email)) {
      res.status(400).send('The email you entered is invalid.');
      return;
    }
    if (!password || !name) {
      res.status(400).send('Missing field(s)');
      return;
    }
    if (!password.match(regex)) {
      res.status(400).send('Weak password. Password must be at least 8 characters.\nAlso must include: 1 number, 1 uppercase, 1 special letter, 1 lowecase letter.');
      return;
    }
    if ((await req.db.collection('users').countDocuments({ email })) > 0) {
      res.status(403).send('The email has already been used.');
      return;
    }
    const hashedPassword = await argon2.hash(password);
    const id = nanoid(12);
    const user_id = await req.db
      .collection('users')
      .insertOne({
        _id: id,
        email,
        password: hashedPassword,
        name,
        lastLogin: new Date(),
        currentLogin: new Date(),
        role: 'pending',
        token: '',
      })
      .then(({ insertedId }) => {
        return insertedId;
      });

    const user = {
      _id: id,
      email,
      password: hashedPassword,
      name,
      lastLogin: new Date(),
      currentLogin: new Date(),
      role: 'pending',
      token: '',
    };

    req.logIn(user, (err) => {
      if (err) throw err;
    });
    res.status(200);
    res.json({});
  });

export default csrf(handler);
