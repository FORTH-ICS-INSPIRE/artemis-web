import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import argon2 from 'argon2';
import auth from '../../middleware/auth';
import { extractUser } from '../../lib/helpers';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface NextApiRequestExtended extends NextApiRequest {
  logIn(user: any, arg1: (err: any) => void);
  db: any;
}

interface NextApiResponseExtended extends NextApiResponse {
  cookie(
    arg0: string,
    token: string,
    arg2: { path: string; httpOnly: boolean; maxAge: number }
  );
}

const handler = nextConnect();

handler.use(auth);

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
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
      const userObj = extractUser(req);

      res.cookie(
        'access_token',
        jwt.sign(
          {
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': [userObj.role],
              'x-hasura-default-role': userObj.role,
              'x-hasura-user-id': '11',
            },
            user: userObj,
          },
          process.env.JWT_SECRET
        ),
        {
          path: '/',
          httpOnly: true,
          maxAge: 604800000, // todo set small timeout and have refresh token impl
          sameSite: 'strict',
          secure: process.env.production === 'true',
        }
      );

      res.status(201).json({
        user: userObj,
      });
    });
  }
);

export default handler;
