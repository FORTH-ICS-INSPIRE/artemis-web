import { Strategy } from 'passport-local';
import argon2 from 'argon2';
import memory from '../../utils/captchaMemoryStore';

export const LocalStrategy = new Strategy(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const user = await req.db.collection('users').findOne({ email });
      if (user?.password === '<REDUCTED>') {
        return done(null, false, {
          message: 'Trying to login with LDAP account',
        });
      } else if (user?.password === '<GOOGLE_ACCOUNT>') {
        return done(null, false, {
          message: 'Trying to login with GOOGLE account',
        });
      }

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
        memory.reset(req.ip);
        console.log({ ...user, id: req.session.id })
        return done(null, { ...user, id: req.session.id });
      } else {
        memory.incr(req.ip);
        return done(null, false, { message: 'Email or password is incorrect' });
      }
    } catch (e) {
      console.error(e);
      return done(null, false, { message: 'An error occured' });
    }
  }
);

export default LocalStrategy;
