import nc from 'next-connect';
import passport from '../libs/passport';
import database from './database';
import { session } from 'next-session';

const auth = nc()
  .use(database)
  .use(
    session({
      cookie: {
        maxAge: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT),
        secure:
          process.env.NODE_ENV === 'production' &&
          process.env.TESTING === 'false',
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(passport.authenticate('remember-me'));

export default auth;
