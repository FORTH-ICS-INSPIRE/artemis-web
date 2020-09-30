export function extractUser(req) {
  if (!req.user) return null;

  const { name, email, password } = req.user;
  return {
    name,
    email,
    password,
  };
}

export default extractUser;
