import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';

const handler = nextConnect();
handler.use(auth);

handler.get((req, res) => {
  if (!req.user) res.send(null);
  else
    res.send({
      access_token: jwt.sign(
        {
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': '11',
          },
          exp: 1602685854,
          sub: 'guest',
          fresh: false,
          type: 'access',
        },
        '44fe431cdc896ccab691ad0599f4e0a12690ce1ededebe57b825823bc6b4d24f'
      ),
    });
});
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
export default handler;
