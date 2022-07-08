import authorization from '../../middleware/authorization';
import { createRouter } from "next-connect";
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { csrf } from '../../libs/csrf';
import limiter from '../../middleware/limiter';

const router = createRouter();

const handler = router
  .use(limiter('hijack'))
  .use(auth)
  .use(authorization(['admin', 'user']))
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const host: string = process.env.DATABASE_HOST;
    const configHost: string = process.env.CONFIG_HOST;
    const port: number = parseInt(process.env.API_PORT, 10);
    let resp = null;
    const allowed_normal_actions = ['hijack_action_acknowledge', 'hijack_action_acknowledge_not'];

    switch (req.body.action) {
      case 'comment':
        if (req.user.role !== 'admin') {
          res.status(401);
          res.json({
            code: 401,
            message: 'Unauthorized',
          });

          break;
        }

        resp = await fetch(`http://${host}:${port}/hijackComment`, {
          method: 'POST',
          body: JSON.stringify({
            key: req.body.key,
            comment: req.body.comment,
          }),
        });

        if (resp.status === 200) {
          res.status(200);
          res.json({ status: 'Comment updated.' });
        } else {
          res.status(500);
          res.json({ status: 'Error' });
        }

        break;
      case 'approve':
        if (req.user.role !== 'admin') {
          res.status(401);
          res.json({
            code: 401,
            message: 'Unauthorized',
          });

          break;
        }

        resp = await fetch(`http://${configHost}:${port}/hijackLearnRule`, {
          method: 'POST',
          body: JSON.stringify({
            key: req.body.hijack_key,
            prefix: req.body.prefix,
            type: req.body.type_,
            hijack_as: req.body.hijack_as,
            action: 'approve',
          }),
        });

        if (resp.status === 200) {
          res.status(200);
          const rule = await resp.json();
          res.json(rule);
        } else {
          res.status(500);
          res.json({ status: 'Error' });
        }

        break;
      case 'show':
        if (req.user.role !== 'admin') {
          res.status(401);
          res.json({
            code: 401,
            message: 'Unauthorized',
          });

          break;
        }

        resp = await fetch(`http://${configHost}:${port}/hijackLearnRule`, {
          method: 'POST',
          body: JSON.stringify({
            key: req.body.hijack_key,
            prefix: req.body.prefix,
            type: req.body.type_,
            hijack_as: req.body.hijack_as,
            action: req.body.action,
          }),
        });

        if (resp.status === 200) {
          res.status(200);
          res.json(await resp.json());
        } else {
          res.status(500);
          res.json({ status: 'Error' });
        }

        break;
      default:
        if (req.user.role !== 'admin' && !allowed_normal_actions.includes(req.body.action)) {
          res.status(401);
          res.json({
            code: 401,
            message: 'Unauthorized',
          });

          break;
        }

        resp = await fetch(`http://${host}:${port}/hijackMultiAction`, {
          method: 'POST',
          body: JSON.stringify({
            keys: req.body.hijack_keys,
            action: req.body.action,
            state: req.body.state,
          }),
        });

        if (resp.status === 200) {
          res.status(200);
          res.json({ status: 'Action updated.' });
        } else {
          res.status(500);
          res.json({ status: 'Error' });
        }

        break;
    }
  });

export default csrf(handler);
