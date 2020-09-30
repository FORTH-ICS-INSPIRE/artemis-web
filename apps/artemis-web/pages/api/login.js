import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import passport from '../../lib/passport';
import { extractUser } from '../../lib/helpers';

const handler = nextConnect();

handler.use(auth);

handler.post(passport.authenticate('local'), (req, res) => {
  res.json({ user: extractUser(req) });
});

export default handler;
