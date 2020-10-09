import { session, Store, MemoryStore } from 'next-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo({ Store, MemoryStore });

export default function (req, res, next) {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  });

  return session({
    store: mongoStore,
    cookie: {
      secure: process.env.production === 'true',
    },
  })(req, res, next);
}
