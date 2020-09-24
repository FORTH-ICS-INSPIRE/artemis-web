import assert from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const MongoClient = require('mongodb').MongoClient;
const jwtSecret = 'SUPERSECRETE20220';

const url = 'mongodb://admin:pass@localhost:27017';
const dbName = 'artemis-web';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const findUser = (db: any, email: string, callback: any) => {
  const collection = db.collection('user');
  collection.findOne({ email }, callback);
};

const authUser = (
  db: any,
  email: string,
  password: string,
  hash: string,
  callback: any
) => {
  bcrypt.compare(password, hash, callback);
};

const updateTime = (db: any, email: string) => {
  const collection = db.collection('user');
  collection.update({ email: email }, { $set: { lastLogin: new Date() } });
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // console.log(req);
    //login
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function (err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function (err, user) {
        if (err) {
          res.status(500).json({ error: true, message: 'Error finding User' });
          return;
        }
        if (!user) {
          res.status(404).json({ error: true, message: 'User not found' });
          return;
        } else {
          authUser(db, email, password, user.password, function (err, match) {
            if (err) {
              res
                .status(500)
                .json({ error: true, message: 'Authentication Failed' });
            }
            if (match) {
              updateTime(db, email);
              const token = jwt.sign(
                {
                  userId: user.userId,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  lastLogin: user.lastLogin,
                },
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                }
              );
              res.status(200).json({ token });
              return;
            } else {
              res
                .status(401)
                .json({ error: true, message: 'Authentication Failed' });
              return;
            }
          });
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.status(405).end();
  }
};
