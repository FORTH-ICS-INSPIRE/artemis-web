// file: lib/csrf.js
import { nextCsrf } from './next-csrf';

const options = {
  secret: process.env.CSRF_SECRET, // Long, randomly-generated, unique, and unpredictable value
  csrfSecret: process.env.CSRF_SECRET,
};

export const { csrf, setup, csrfToken } = nextCsrf(options);
