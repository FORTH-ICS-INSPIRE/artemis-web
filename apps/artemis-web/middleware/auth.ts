import nextConnect from 'next-connect';
import passport from '../lib/passport';
import database from './database';
import session from '../middleware/session';

const auth = nextConnect()
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(
    passport.session({
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    })
  )
  .use(passport.authenticate('remember-me'));

export default auth;
