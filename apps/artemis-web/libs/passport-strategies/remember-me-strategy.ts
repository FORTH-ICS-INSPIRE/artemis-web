import { Strategy } from 'passport-remember-me';
import { getRandomString } from '../../utils/token';
import { Db, MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbInstance: Db = null;

if (!client.isConnected()) client.connect();
dbInstance = client.db(process.env.MONGODB_NAME);

export const RememberMeStrategy = new Strategy(
  (token, done) => {
    if (!dbInstance) return done(null, false);

    dbInstance
      .collection('users')
      .findOne({ token: token })
      .then(function (user) {
        if (!user) return done(null, false);

        return done(null, user);
      });
  },
  async (user, done) => {
    const nToken = getRandomString(64);
    if (!user) return done(null, false);

    dbInstance.collection('users').updateOne(
      { email: user.email },
      {
        $set: {
          token: nToken,
        },
      }
    );
    return done(null, nToken);
  }
);

export default RememberMeStrategy;
