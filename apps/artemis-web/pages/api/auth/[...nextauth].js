import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
const MongoClient = require('mongodb').MongoClient;
const jwtSecret = 'SUPERSECRETE20220';
import bcrypt from 'bcrypt';
import useSWR from "swr";

const saltRounds = 10;
const url = 'mongodb://admin:pass@localhost:27017';
const dbName = 'artemis-web';
let db = null;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  if (err) {
    console.error('[mongo] client err', err);
    return reject(err);
  }

  console.log('[mongo] connected');
  db = client.db(dbName);
});

const findUser = (db, email, callback) => {
  const collection = db.collection('user');
  collection.findOne({ email }, callback);
};

const authUser = (
  db,
  email,
  password,
  hash,
  callback
) => {
  bcrypt.compare(password, hash, callback);
};

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "email", type: "text" },
        password: {  label: "password", type: "password" }
      },
      authorize: async (credentials) => {
          const email = credentials.email;
          const password = credentials.password;
          let hash;
          let isValidUser = false;
          let myUser;
          await db.collection('user').findOne({ email: email }).then((err, user) => {
            hash = err.password;
            myUser = err;
            // console.log(myUser)
          });
          await bcrypt.compare(password, hash).then((match, err) => isValidUser = match);

        // const muser = { image: 1, name: 'J Smith', email: 'aaaa@example.com' }
        // return Promise.resolve(muser)
        if (isValidUser) {
          // Any object returned will be saved in `user` property of the JWT
          return Promise.resolve(myUser)
        } else {
          console.log("errro")
          // If you return null or false then the credentials will be rejected
          return Promise.resolve(null)
          // You can also Reject this callback with an Error or with a URL:
          // return Promise.reject(new Error('error message')) // Redirect to error page
          // return Promise.reject('/path/to/redirect')        // Redirect to a URL
        }
      },
      callbacks: {
        redirect: async (url, baseUrl) => {
          return Promise.resolve(baseUrl)
        },
        session: async (session, user) => {
          return Promise.resolve(session)
        },
        jwt: async (token, user, account, profile, isNewUser) => {
          return Promise.resolve(token)
        }
    }
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/login'
  },
  events: {
    session: async (message) => { console.log(message) },
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
}

export default (req, res) => NextAuth(req, res, options)