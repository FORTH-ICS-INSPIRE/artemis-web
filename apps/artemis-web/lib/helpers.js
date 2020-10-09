export function extractUser(req) {
  if (!req.user) return null;

  const { name, email, role, lastLogin } = req.user;
  return {
    name,
    email,
    role,
    lastLogin,
  };
}

export default extractUser;
