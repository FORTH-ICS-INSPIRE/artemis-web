import nc from 'next-connect';
import passport from '../lib/passport';
import database from './database';
import session from '../middleware/session';

const auth = nc()
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(passport.session())
  .use(passport.authenticate('remember-me'));

export default auth;
