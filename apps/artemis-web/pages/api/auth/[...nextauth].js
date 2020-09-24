import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
const MongoClient = require('mongodb').MongoClient;
import bcrypt from 'bcrypt';
import uuid from 'uuid';

const v4 = uuid.v4;

const saltRounds = 10;
const url = 'mongodb://admin:pass@localhost:27017';
const dbName = 'artemis-web';

const initializeDB = (dbName) => {
  let db;
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) {
      console.error('[mongo] client err', err);
      return reject(err);
    }

    console.log('[mongo] connected');
    db = client.db(dbName);
  });

  return client;
};

const client = initializeDB(dbName);

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      authorize: async (credentials) => {
        const email = credentials.email;
        const password = credentials.password;
        const username = credentials.username;
        let hash;
        let isValidUser = false;
        let myUser;
        if (credentials.stype === 'signin') {
          await db
            .collection('user')
            .findOne({ email: email })
            .then((err, user) => {
              hash = err.password;
              myUser = err;
              // console.log(myUser)
            });
          await bcrypt
            .compare(password, hash)
            .then((match, err) => (isValidUser = match));

          if (isValidUser) {
            await db
              .collection('user')
              .update({ email: email }, { $set: { lastLogin: new Date() } });
            // Any object returned will be saved in `user` property of the JWT
            return Promise.resolve(myUser);
          } else {
            console.log('errro');
            // If you return null or false then the credentials will be rejected
            return Promise.resolve(null);
          }
        } else {
          console.log('signup');
          let mHash;
          await bcrypt
            .hash(password, saltRounds)
            .then((hash) => (mHash = hash));
          // Store hash in your password DB.
          await db
            .collection('user')
            .insertOne({
              userId: v4(),
              username,
              email,
              password: hash,
              role: 'user',
              lastLogin: new Date(),
            })
            .then((err) => err);

          return Promise.resolve({
            userId: v4(),
            username,
            email,
            role: 'user',
            lastLogin: new Date(),
          });
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    redirect: async (url, baseUrl) => {
      return Promise.resolve(baseUrl);
    },
    session: async (session, user) => {
      if (user) {
        session.user.username = user.username;
        session.user.lastLogin = user.lastLogin;
      }
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        token.username = user.username;
        token.lastLogin = user.lastLogin;
      }
      return Promise.resolve(token);
    },
  },
  pages: {
    signIn: '/login',
  },
  events: {
    session: async (message) => {},
  },
  session: {
    jwt: true,
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
  },
  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
