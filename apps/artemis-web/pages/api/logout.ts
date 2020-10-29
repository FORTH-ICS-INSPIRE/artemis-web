import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nextConnect();

interface NextApiRequestExtended extends NextApiRequest {
  logOut();
}

interface NextApiResponseExtended extends NextApiResponse {
  status(number);
  clearCookie(string);
}

handler
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    req.logOut();
    res.clearCookie('remember_me');
    res.clearCookie('access_token');
    res.status(204).end();
  });

handler.delete((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
  req.logOut();
  res.clearCookie('remember_me');
  res.clearCookie('access_token');
  res.status(204).end();
});

export default handler;
