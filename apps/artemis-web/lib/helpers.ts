import jwt from 'jsonwebtoken';

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

export function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
}

export function setAccessCookie(req, res) {
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

  res.cookie('access_token', token, {
    path: '/',
    httpOnly: true,
    maxAge: 604800000, // todo set small timeout and have refresh token impl
    sameSite: 'strict',
    secure: process.env.production === 'true',
  });

  return token;
}
