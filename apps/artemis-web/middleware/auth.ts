import nc from 'next-connect';
import passport from '../libs/passport';
import database from './database';
import { session } from 'next-session';

const auth = nc()
  .use(database)
  .use(
    session({
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(passport.authenticate('remember-me'));

export default auth;
