import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { csrf } from '../../libs/csrf';

const handler = nc()
  .use(auth)
  .use(authorization(['user', 'admin']))
  .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const host: string = process.env.API_HOST;
    const port: number = parseInt(process.env.API_PORT, 10);

    const resp = await fetch(`http://${host}:${port}/view_configs`, {
      method: 'GET',
    });

    if (resp.status === 200) {
      res.status(200);
      res.json({ configs: await resp.json() });
    } else {
      res.status(500);
      res.json({ status: 'Error' });
    }
  });

export default csrf(handler);
