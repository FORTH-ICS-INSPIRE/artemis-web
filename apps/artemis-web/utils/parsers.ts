import { getRandomString } from './token';

export function extractUser(req) {
  if (!req.user) return null;

  const { _id, name, email, role, lastLogin } = req.user;
  return {
    _id,
    name,
    email,
    role,
    lastLogin,
  };
}

export function extractLdapUser(req) {
  if (!req.user) return null;

  const mail = req.user[process.env.LDAP_EMAIL_FIELDNAME];

  req.db.collection('users').updateOne(
    {
      email: mail,
    },
    {
      $set: {
        name: mail,
        email: mail,
        password: '<REDUCTED>',
        lastLogin: new Date(),
        currentLogin: new Date(),
        role: 'user', // just for testing. normally it will be 'pending'
      },
    },
    {
      upsert: true,
    }
  );

  return {
    _id: 999,
    name: mail,
    email: mail,
    role: 'user',
    lastLogin: new Date(),
  };
}

export function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
}
