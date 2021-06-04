import Strategy from 'passport-ldapauth';

const LDAP_URI = `${process.env.LDAP_PROTOCOL}://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}`;
const LDAP_MATCHING_RULE_IN_CHAIN = '1.2.840.113556.1.4.1941';
export const LdapStrategy = new Strategy({
  server: {
    url: LDAP_URI,
    bindDN: process.env.LDAP_BIND_DN,
    bindCredentials: process.env.LDAP_BIND_SECRET,
    searchBase: process.env.LDAP_SEARCH_BASE,
    searchFilter: process.env.LDAP_SEARCH_FILTER,
    searchAttributes: process.env.LDAP_SEARCH_ATTRIBUTES?.split(','),
    groupSearchBase: process.env.LDAP_GROUP_SEARCH_BASE,
    groupSearchFilter: process.env.LDAP_GROUP_SEARCH_FILTER,
    groupSearchAttributes: process.env.LDAP_GROUP_SEARCH_ATTRIBUTES,
  },
  usernameField: 'email',
});

export default LdapStrategy;
