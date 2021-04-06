import nc from 'next-connect';
import auth from '../../../middleware/auth';
import { extractUser } from '../../../utils/parsers';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../../definitions';
import jwt from 'jsonwebtoken';
import { csrf } from 'apps/artemis-web/libs/csrf';

const handler = nc()
  .use(auth)
  .get((req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    if (!req.user) res.send({});
    else {
      const userObj = extractUser(req);
      const token = jwt.sign(
        {
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': [userObj.role],
            'x-hasura-default-role': userObj.role,
            'x-hasura-user-id': userObj._id,
          },
          user: userObj,
        },
        process.env.JWT_SECRET
      );
      res.send({
        accessToken: token,
      });
    }
  });

export default csrf(handler);
