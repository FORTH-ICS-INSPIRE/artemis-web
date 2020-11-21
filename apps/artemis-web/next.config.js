module.exports = {
  env: {
    GRAPHQL_URI: `http://${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}/v1/graphql`,
    GRAPHQL_WS_URI: `ws://${process.env.GRAPHQL_HOST}:${process.env.GRAPHQL_PORT}/v1/graphql`,
    LDAP_URI: `${process.env.LDAP_PROTOCOL}://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`,
  },
};
