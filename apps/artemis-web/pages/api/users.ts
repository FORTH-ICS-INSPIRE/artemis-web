import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import bcrypt from 'bcrypt';
import auth from '../../middleware/auth';
import { extractUser } from '../../lib/helpers';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestExtended extends NextApiRequest {
  logIn(user: any, arg1: (err: any) => void);
  db: any;
}

const handler = nextConnect();

handler.use(auth);

handler.post(async (req: NextApiRequestExtended, res: NextApiResponse) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);
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
  const hashedPassword = await bcrypt.hash(password, 10);
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
    res.status(201).json({
      user: extractUser(req),
    });
  });
});

export default handler;
