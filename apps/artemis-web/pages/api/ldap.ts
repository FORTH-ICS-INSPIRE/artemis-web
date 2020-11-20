import nextConnect from 'next-connect';
import passport from '../../lib/passport';
import auth from '../../middleware/auth';

const handler = nextConnect()
  .use(auth)
  .post(
    passport.authenticate('ldapauth', {
      session: false,
    })
  );

export default handler;
