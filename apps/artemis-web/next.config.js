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
            defaultSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://code.jquery.com"]
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      }),
    }];
  },
};