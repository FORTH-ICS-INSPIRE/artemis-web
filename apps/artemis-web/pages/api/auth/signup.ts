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
const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET

const handler = nc()
  .use(auth)
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    const captchaResult = lambdaCaptcha.verify(req.body.encryptedExpr, req.body.captcha, SECRET);

    if (captchaResult === 'invalid_solution') {
      res.status(400).send('Captcha solution is incorrect.');
      return;
    }

    if (!isEmail(email)) {
      res.status(400).send('The email you entered is invalid.');
      return;
    }
    if (!password || !name) {
      res.status(400).send('Missing field(s)');
      return;
    }
    if ((await req.db.collection('users').countDocuments({ email })) > 0) {
      res.status(403).send('The email has already been used.');
      return;
    }
    const hashedPassword = await argon2.hash(password);
    const user = await req.db
      .collection('users')
      .insertOne({
        _id: nanoid(12),
        email,
        password: hashedPassword,
        name,
        lastLogin: new Date(),
        currentLogin: new Date(),
        role: 'pending',
        token: '',
      })
      .then(({ ops }) => ops[0]);

    req.logIn(user, (err) => {
      if (err) throw err;
    });
    res.status(200);
    res.json({});
  });

export default csrf(handler);
