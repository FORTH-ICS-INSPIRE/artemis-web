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
