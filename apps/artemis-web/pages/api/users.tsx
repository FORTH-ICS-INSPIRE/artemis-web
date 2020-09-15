import assert from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

const MongoClient = require('mongodb').MongoClient;
const v4 = uuid.v4;
const jwtSecret = 'SUPERSECRETE20220';

const saltRounds = 10;
const url = 'mongodb://admin:pass@localhost:27017';
const dbName = 'artemis-web';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db: any, email: string, callback: any) {
  const collection = db.collection('user');
  collection.findOne({ email }, callback);
}

function createUser(
  db: any,
  username: string,
  email: string,
  password: string,
  callback: any
) {
  const collection = db.collection('user');
  bcrypt.hash(password, saltRounds, function (err: any, hash: string) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        userId: v4(),
        username,
        email,
        password: hash,
      },
      function (err: any, userCreated: any) {
        assert.equal(err, null);
        callback(userCreated);
      }
    );
  });
}

export default (req: any, res: any) => {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
      assert.notEqual(null, req.body.username, 'Username required');
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message });
    }

    // verify email does not exist already
    client.connect(function (err: any) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;
      const username = req.body.username;

      findUser(db, email, function (err: any, user: object) {
        if (err) {
          res.status(500).json({ error: true, message: 'Error finding User' });
          return;
        }
        if (!user) {
          // proceed to Create
          createUser(db, username, email, password, function (
            creationResult: any
          ) {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                {
                  userId: user.userId,
                  email: user.email,
                  username: user.username,
                },
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                }
              );
              res.status(200).json({ token });
              return;
            }
          });
        } else {
          // User exists
          res.status(403).json({ error: true, message: 'Email exists' });
          return;
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.status(200).json({ users: ['John Doe'] });
  }
};
