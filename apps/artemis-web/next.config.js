// /next.config.js
require("dotenv").config({
  path: `.env`,
})

module.exports = {
  poweredByHeader: false,
  i18n: { locales: ['en'], defaultLocale: 'en' },
  basePath: process.env.ARTEMIS_WEB_BASE_DIR,
};
