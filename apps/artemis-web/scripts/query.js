require('dotenv').config();

const email = process.env.DEFAULT_EMAIL;
const password = process.env.DEFAULT_PASS;
const URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;

async function isInCollection(db, name) {
  const collections = await db.listCollections().toArray();
  const filtered = collections.filter((collection) => collection.name === name);
  return filtered.length > 0;
}

(async function () {
  const { MongoClient } = require('mongodb');
  const argon2 = require('argon2');
  const { nanoid } = require('nanoid');

  const client = new MongoClient(URI);
  try {
    await client.connect();

    const db = client.db('artemis-web');
    if (!(await isInCollection(db, 'users'))) {
      db.createCollection('users', function (err, res) {
        if (err) throw err;
      });
    }
    const user = await db.collection('users').findOne();
    console.log(user)
    if (user == null) {
      db.collection('users').insertOne(
        {
          _id: nanoid(12),
          email: email,
          password: await argon2.hash(password),
          name: 'Admin',
          lastLogin: new Date(),
          currentLogin: new Date(),
          role: 'admin',
          token: '',
        },
        (err, res) => {
          console.error(err);
          client.close();
        }
      );
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
})();
