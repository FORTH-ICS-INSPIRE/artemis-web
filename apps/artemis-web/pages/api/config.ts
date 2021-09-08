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
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const host: string = process.env.CONFIG_HOST;
    const port: number = parseInt(process.env.CONFIG_PORT, 10);

    const resp = await fetch(`http://${host}:${port}/config`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'yaml',
        content: { config: req.body.new_config, comment: req.body.comment },
      }),
    });
    if (resp.status === 200) {
      res.status(200);
      const json = await resp.json();
      if (json.success)
        res.json({ success: true, status: 'Configuration file updated.' });
      else
        res.json({ success: false, status: json.message });
    } else {
      res.status(500);
      res.json({ status: 'Error' });
    }
  });

export default csrf(handler);
