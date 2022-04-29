// /next.config.js
require('dotenv').config({
  path: `.env`,
});
const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  poweredByHeader: false,
  i18n: { locales: ['en'], defaultLocale: 'en' },
  basePath: process.env.ARTEMIS_WEB_BASE_DIR,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.jsdelivr.net/',
                'https://code.jquery.com',
              ],
              scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                'https://cdn.jsdelivr.net/',
                'https://code.jquery.com',
              ],
              connectSrc: [
                "'self'",
                'https://stat.ripe.net',
                'wss://localhost',
                'wss://demo.bgpartemis.org',
                'wss://demo.artemis-pc.duckdns.org',
                'https://localhost/api/graphql',
                'http://localhost/api/graphql',
                'https://demo.artemis-pc.duckdns.org/api/graphql',
                'https://accounts.google.com/o/oauth2/v2/auth'
              ],
              frameAncestors: "'none",
              imgSrc: ["'self'", 'data:'],
              objectSrc: "'none",
            },
          },
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true },
          ],
          referrerPolicy: 'origin',
        }),
      },
    ];
  },
};
