import nextConnect from 'next-connect';
import passport from '../lib/passport';
import session from './session';
import database from './database';

const auth = nextConnect()
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(
    passport.session({
      cookie: {
        secure: process.env.production === 'true',
      },
    })
  )
  .use(passport.authenticate('remember-me'));

export default auth;
