import nextConnect from 'next-connect';
import passport from '../lib/passport';
import session from '../lib/session';
import database from './database';

const auth = nextConnect()
  .use(
    session({
      name: 'sess',
      secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw', // This should be kept securely, preferably in env vars
      cookie: {
        maxAge: 60 * 60 * 8, // 8 hours,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      },
    })
  )
  .use(database)
  .use(passport.initialize())
  .use(passport.session());

export default auth;
