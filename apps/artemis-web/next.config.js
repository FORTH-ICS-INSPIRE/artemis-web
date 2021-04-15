// /next.config.js
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: "'self'",
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://code.jquery.com"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://code.jquery.com"]
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      }),
    }];
  },
};