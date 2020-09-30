export async function getUser(req, userId) {
  const user = await req.db.collection('users').findOne({
    _id: userId,
  });
  if (!user) return null;
  const { _id, name, email, emailVerified } = user;
  const isAuth = _id === req.user?._id;
  return {
    _id,
    name,
    email: isAuth ? email : null,
    emailVerified: isAuth ? emailVerified : null,
  };
}
