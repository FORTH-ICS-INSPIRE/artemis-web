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
            defaultSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com", "https://demo.artemis-pc.duckdns.org"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com", "https://demo.artemis-pc.duckdns.org"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com", "https://demo.artemis-pc.duckdns.org"]
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      }),
    }];
  },
};