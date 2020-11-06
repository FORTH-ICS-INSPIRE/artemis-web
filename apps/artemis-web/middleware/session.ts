import { session } from 'next-session';

export default function (req, res, next) {
  return session({
    cookie: {
      secure: process.env.NODE_ENV === 'production',
    },
  })(req, res, next);
}
