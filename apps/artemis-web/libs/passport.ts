import passport from 'passport';
import { NextApiRequestExtended } from '../definitions';
import { LocalStrategy } from './passport-strategies/local-strategy';
import { RememberMeStrategy } from './passport-strategies/remember-me-strategy';
import { LdapStrategy } from './passport-strategies/ldap-strategy';

passport.serializeUser((user: any, done) => {
  const email = user?.email || user[process.env.LDAP_EMAIL_FIELDNAME];
  done(null, email.toString());
});

passport.deserializeUser((req: NextApiRequestExtended, email: string, done) => {
  req.db
    .collection('users')
    .findOne({ email: email })
    .then((user) => {
      done(null, user);
    });
});

passport.use(LocalStrategy);
passport.use(RememberMeStrategy);

if (process.env.LDAP_ENABLED === 'true') {
  passport.use(LdapStrategy);
}

export default passport;
