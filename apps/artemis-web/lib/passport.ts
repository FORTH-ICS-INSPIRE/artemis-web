import passport from 'passport';
import argon2 from 'argon2';
import getRandomString from '../utils/token';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as RememberMeStrategy } from 'passport-remember-me';

const LdapStrategy = require('passport-ldapauth');
let dbInstance = null;

passport.serializeUser((user, done) => {
  done(null, user.email.toString());
});

passport.deserializeUser((req, email, done) => {
  req.db
    .collection('users')
    .findOne({ email: email })
    .then((user) => {
      done(null, user);
    });
});

const OPTS = {
  server: {
    url: 'ldap://localhost:389',
    bindDn: 'cn=admin,dc=planetexpress,dc=com',
    bindCredentials: 'GoodNewsEveryone',
    searchBase: 'ou=people,dc=planetexpress,dc=com',
    searchFilter: '(uid={{username}})',
    // searchAttributes: ['mail', 'uid']
  }
};

passport.use(new LdapStrategy(OPTS));

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      dbInstance = req.db;
      const user = await req.db.collection('users').findOne({ email });
      if (user && (await argon2.verify(user.password, password))) {
        const lastLogin = user.currentLogin;
        await req.db.collection('users').updateOne(
          { email: email },
          {
            $set: {
              currentLogin: new Date(),
              lastLogin: lastLogin,
            },
          }
        );
        done(null, user);
      } else done(null, false, { message: 'Email or password is incorrect' });
    }
  )
);

passport.use(
  new RememberMeStrategy(
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
  )
);

export default passport;
