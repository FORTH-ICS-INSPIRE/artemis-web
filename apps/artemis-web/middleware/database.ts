import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

export async function setUpDb(db) {
  db.collection('tokens').createIndex(
    { expireAt: -1 },
    { expireAfterSeconds: 0 }
  );
  db.collection('users').createIndex({ email: 1 }, { unique: true });
}

export default async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.MONGODB_NAME);
  await setUpDb(req.db);
  return next();
}
