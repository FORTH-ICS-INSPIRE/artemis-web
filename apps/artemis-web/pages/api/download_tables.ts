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
  .use(authorization(['admin', 'user']))
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const host: string = process.env.API_HOST;
    const port: number = parseInt(process.env.API_PORT, 10);

    const resp = await fetch(
      `http://${host}:${port}/${req.body.action}${req.body.parameters ? '?and=' + req.body.parameters : ''
      }`,
      {
        method: 'GET',
      }
    );

    res.status(200);
    res.json(await resp.json());
  });

export default handler;
