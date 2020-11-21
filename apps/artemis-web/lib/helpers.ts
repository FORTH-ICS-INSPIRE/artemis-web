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

  const { cn, mail, employeeType } = req.user;
  return {
    _id: 999,
    name: cn,
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
