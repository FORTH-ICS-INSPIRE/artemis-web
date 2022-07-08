import { createRouter } from "next-connect";
import auth from '../../../middleware/auth';
import { extractUser } from '../../../utils/parsers';
import { NextApiRequest, NextApiResponse } from 'next';
import { csrf } from '../../../libs/csrf';
import limiter from '../../../middleware/limiter';

const router = createRouter();

const handler = router
  .use(limiter('userinfo'))
  .use(auth)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    res.json({ user: extractUser(req) });
  });

export default csrf(handler);
