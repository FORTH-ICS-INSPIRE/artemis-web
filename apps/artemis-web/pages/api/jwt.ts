import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestExtended extends NextApiRequest {
  user: any;
}

interface NextApiResponseExtended extends NextApiResponse {
  send(arg0: any);
}

const handler = nextConnect();
handler.use(auth);

handler.get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
  if (!req.user) res.send(null);
  else {
    const now = new Date();
    let time = now.getTime();
    time += 3600 * 1000;
    
    res.send({
      accessToken: jwt.sign(
        {
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': '11',
          },
          exp: time,
          sub: req.user.role,
          fresh: false,
          type: 'access',
        },
       process.env.JWT_SECRET 
      ),
    });
  }
});

export default handler;
