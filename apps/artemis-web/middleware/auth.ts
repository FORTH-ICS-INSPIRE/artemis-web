import nc from 'next-connect';
import passport from '../libs/passport';
import database from './database';
import nextSession from "next-session";
const getSession = nextSession({
  cookie: {
    maxAge: parseInt(process.env.SESSION_TIMEOUT, 10),
    secure:
      process.env.NODE_ENV === 'production' &&
      process.env.TESTING === 'false',
  },
});

function withSession(handler) {
  return async function handlerWithSession(req, res) {
    await getSession(req, res);
    return handler(req, res);
  };
}

async function session(req, res, next) {
  try {
    await getSession(req, res);
    next();
  } catch (err) {
    next(err);
  }
}

const auth = nc()
  .use(database)
  .use(
    session
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(passport.authenticate('remember-me'));

export default auth;
