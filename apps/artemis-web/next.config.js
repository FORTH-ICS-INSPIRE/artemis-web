module.exports = {
  env: {
    GRAPHQL_URI: `http://${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}/v1/graphql`,
    GRAPHQL_WS_URI: `ws://${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}/v1/graphql`,
    MONGODB_URI: `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
    LDAP_URI: `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`
  },
};
