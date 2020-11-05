import nextConnect from 'next-connect';
import auth from '../../middleware/auth';

import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import { useCookie } from 'next-cookie';

const handler = nextConnect()
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    const pathname = '/',
      query = null,
      AppTree = null;
    const cookies = useCookie({ req, res, pathname, query, AppTree });
    const accessToken: string = cookies.get('access_token');

    if (!accessToken) res.send(null);
    else {
      res.send({ accessToken });
    }
  });

export default handler;
