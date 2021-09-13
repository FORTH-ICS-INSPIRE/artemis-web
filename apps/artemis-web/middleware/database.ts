import { Db, MongoClient } from 'mongodb';

const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
const client = new MongoClient(MONGODB_URI, {
});

export async function setUpDb(db: Db) {
  db.collection('tokens').createIndex(
    { expireAt: -1 },
    { expireAfterSeconds: 0 }
  );
  db.collection('users').createIndex({ email: 1 }, { unique: true });
}

export default async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.MONGODB_NAME);
  await setUpDb(req.db);
  return next();
}
