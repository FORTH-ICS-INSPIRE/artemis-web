import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import { extractUser } from '../../lib/helpers';

const handler = nextConnect();
handler.use(auth);
handler.get(async (req, res) => res.json({ user: extractUser(req) }));

export default handler;
