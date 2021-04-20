// /next.config.js
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  poweredByHeader: false,
  i18n: { locales: ["en"], defaultLocale: "en", },
  async headers() {
    return [{
      source: "/:path*",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/", "https://code.jquery.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net/", "https://code.jquery.com"],
            connectSrc: ["'self'", "https://stat.ripe.net", "wss://localhost", "wss://demo.bgpartemis.org"],
            frameAncestors: "'none",
            imgSrc: ["'self'", "data:*"],
            objectSrc: "'none",
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "strict-origin-when-cross-origin",
      }),
    }];
  },
};