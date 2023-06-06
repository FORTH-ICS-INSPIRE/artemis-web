export default function authorization(allowedRoles) {
  return async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(401);
      res.json({
        code: 401,
        message: 'Unauthorized',
      });
    } else return next();
  };
}
