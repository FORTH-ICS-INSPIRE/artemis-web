// /next.config.js
const { createSecureHeaders } = require('next-secure-headers');


require("dotenv").config({
  path: `.env`,
})

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  poweredByHeader: false,
  i18n: { locales: ['en'], defaultLocale: 'en' },
  basePath: process.env.ARTEMIS_WEB_BASE_DIR,
};
