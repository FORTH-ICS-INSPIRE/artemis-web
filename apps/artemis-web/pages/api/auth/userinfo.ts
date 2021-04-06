import nc from 'next-connect';
import auth from '../../../middleware/auth';
import { extractUser } from '../../../utils/parsers';
import { NextApiRequest, NextApiResponse } from 'next';
import { csrf } from 'apps/artemis-web/libs/csrf';

const handler = nc()
  .use(auth)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    res.json({ user: extractUser(req) });
  });

export default csrf(handler);
