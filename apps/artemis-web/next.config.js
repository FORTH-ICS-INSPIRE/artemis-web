module.exports = {
  env: {
    MONGODB_URI: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
    LDAP_URI: `${process.env.LDAP_PROTOCOL}://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`,
  },
};
