import Strategy from 'passport-ldapauth';

const LDAP_URI = `${process.env.LDAP_PROTOCOL}://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`;

export const LdapStrategy = new Strategy({
  server: {
    url: LDAP_URI,
    bindDN: process.env.LDAP_BIND_DN,
    bindCredentials: process.env.LDAP_BIND_SECRET,
    searchBase: process.env.LDAP_SEARCH_BASE,
    searchFilter: process.env.LDAP_SEARCH_FILTER,
    searchAttributes: process.env.LDAP_SEARCH_ATTRIBUTES?.split(','),
  },
  usernameField: 'email',
});

export default LdapStrategy;
