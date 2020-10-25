export function extractUser(req) {
  if (!req.user) return null;

  const { name, email, role, lastLogin } = req.user;
  const lastLoginStr = lastLogin.toString();

  return {
    name,
    email,
    role,
    lastLoginStr,
  };
}

export default extractUser;
