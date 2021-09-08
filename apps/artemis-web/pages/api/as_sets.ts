import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { csrf } from '../../libs/csrf';
import limiter from '../../middleware/limiter';

const handler = nc()
  .use(limiter)
  .use(auth)
  .use(authorization(['admin']))
  .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const host: string = process.env.CONFIG_HOST;
    const port: number = parseInt(process.env.CONFIG_PORT, 10);

    const resp = await fetch(`http://${host}:${port}/loadAsSets`, {
      method: 'GET',
    });

    if (resp.status === 200) {
      res.status(200);
      res.json({ payload: await resp.json() });
    } else {
      res.status(500);
      res.json({ status: 'Error' });
    }
  });

export default handler;
