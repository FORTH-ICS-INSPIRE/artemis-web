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

export function setAccessCookie(req, res) {
  const userObj = extractUser(req);
  const accessToken = jwt.sign(
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
  res.cookie('access_token', accessToken, {
    path: '/',
    httpOnly: true,
    maxAge: 604800000, // todo set small timeout and have refresh token impl
    sameSite: 'strict',
    secure: process.env.production === 'true',
  });
  res.json({ accessToken: accessToken });
}
