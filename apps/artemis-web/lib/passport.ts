import passport from 'passport';
import argon2 from 'argon2';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as RememberMeStrategy } from 'passport-remember-me';
import getRandomString from '../utils/token';
const LdapStrategy = require('passport-ldapauth').Strategy;

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

const getLDAPConfiguration = function (req, callback) {
  process.nextTick(function () {
    const OPTS = {
      server: {
        url: `${process.env['SECURITY_LDAP_URI']}://localhost:389`,
        bindDn: process.env['SECURITY_LDAP_BIND_DN'],
        bindCredentials: process.env['SECURITY_LDAP_BIND_PASSWORD'],
        searchBase: process.env['SECURITY_LDAP_BASE_DN'],
        searchFilter: process.env['SECURITY_LDAP_SEARCH_FILTER'],
      },
    };
    callback(null, OPTS);
  });
};

passport.use(
  new LdapStrategy(getLDAPConfiguration, function (user, done) {
    console.log(user);
    return done(null, user);
  })
);

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
