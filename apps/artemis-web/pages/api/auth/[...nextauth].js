import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import bcrypt from 'bcrypt';
import uuid from 'uuid';
import { initializeDB } from '../../../utils/database';

const saltRounds = 10;
const v4 = uuid.v4;

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
        try {
          const db = await initializeDB();
          const email = credentials.email;
          const password = credentials.password;
          const username = credentials.username;
          let isValidUser = false,
            currUser;
          if (credentials.stype === 'signin') {
            await db
              .collection('user')
              .findOne({ email: email })
              .then((user, err) => {
                currUser = user;
              });
            if (!currUser) {
              return Promise.resolve(null);
            }
            await bcrypt
              .compare(password, currUser.password)
              .then((match, err) => (isValidUser = match));

            if (isValidUser) {
              await db
                .collection('user')
                .update({ email: email }, { $set: { lastLogin: new Date() } });
              // Any object returned will be saved in `user` property of the JWT
              return Promise.resolve(currUser);
            } else {
              console.log('errro');
              // If you return null or false then the credentials will be rejected
              return Promise.resolve(null);
            }
          } else {
            let mHash;
            await bcrypt.hash(password, saltRounds).then((hash) => {
              mHash = hash;
            });
            // Store hash in your password DB.
            let newUser = {
              userId: v4(),
              username: username,
              email: email,
              password: mHash,
              role: 'user',
              lastLogin: new Date(),
            };
            await db
              .collection('user')
              .insertOne(newUser)
              .then((err) => err);

            return Promise.resolve(newUser);
          }
        } catch (err) {
          console.error(err);
          return Promise.resolve(null);
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
    error: async (message) => {
      console.error(message);
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.JWT_SECRET,
  },
  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGODB_URI,
};

export default (req, res) => NextAuth(req, res, options);
