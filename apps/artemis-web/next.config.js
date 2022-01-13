// /next.config.js
require('dotenv').config({
  path: `.env`,
});
const { createSecureHeaders } = require('next-secure-headers');
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
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
                'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
              ],
              scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                'https://cdn.jsdelivr.net/',
                'https://code.jquery.com',
                'https://code.jquery.com/jquery-3.5.1.slim.min.js',
              ],
              connectSrc: [
                "'self'",
                'https://stat.ripe.net',
                'wss://localhost',
                'wss://demo.bgpartemis.org',
                'wss://demo.artemis-pc.duckdns.org',
                'https://localhost/api/graphql',
                'http://localhost/api/graphql',
                'https://code.jquery.com/',
                'https://cdn.jsdelivr.net/',
                'https://firebaseinstallations.googleapis.com/v1/projects/artemis-304609/installations',
                'https://fcmregistrations.googleapis.com/v1/projects/artemis-304609/registrations',
              ],
              imgSrc: ["'self'", 'data:'],
            },
          },
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true },
          ],
          referrerPolicy: 'strict-origin-when-cross-origin',
        }),
      },
    ];
  },
});
