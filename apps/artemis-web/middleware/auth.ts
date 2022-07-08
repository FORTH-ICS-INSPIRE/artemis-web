import passport from '../libs/passport';
import database from './database';
import nextSession from 'next-session';
import { createRouter } from "next-connect";

const getSession = nextSession({
  cookie: {
    maxAge: parseInt(process.env.SESSION_TIMEOUT, 10),
    secure:
      process.env.NODE_ENV === 'production' && process.env.TESTING === 'false',
  },
});

async function session(req, res, next) {
  try {
    await getSession(req, res);
    next();
  } catch (err) {
    next(err);
  }
}

const router = createRouter();

const auth = router
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(passport.session())
  .use(passport.authenticate('remember-me'));

export default auth;
